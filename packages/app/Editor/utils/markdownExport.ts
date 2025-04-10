import type { ElementTransformer, TextFormatTransformer, TextMatchTransformer, Transformer } from '@lexical/markdown'
import type { ElementNode, LexicalNode, TextFormatType, TextNode } from 'lexical'

import { $getRoot, $isDecoratorNode, $isElementNode, $isLineBreakNode, $isTextNode } from 'lexical'

import { $isMermaidNode } from '../plugins/Mermaid/utils'
import { $isNavigationNode } from '../plugins/Navigation/utils'
import { $isEmptyParagraph, transformersByType } from './'

import type MermaidNode from '../plugins/Mermaid/Node'
import type NavigationNode from '../plugins/Navigation/Node'

export function createMarkdownExport(
	transformers: Array<Transformer>,
	shouldPreserveNewLines: boolean = false
): (node?: ElementNode) => string {
	const byType = transformersByType(transformers)
	const isNewlineDelimited = !shouldPreserveNewLines

	// Export only uses text formats that are responsible for single format
	// e.g. it will filter out *** (bold, italic) and instead use separate ** and *
	const textFormatTransformers = byType.textFormat.filter(transformer => transformer.format.length === 1)

	return node => {
		const output = []
		const children = (node || $getRoot()).getChildren()

		for (let i = 0; i < children.length; i++) {
			const child = children[i]

			let result = ''

			if ($isMermaidNode(child)) {
				result = outputMermaid(child as MermaidNode)
			} else if ($isNavigationNode(child)) {
				result = outputNavigation(child as NavigationNode)
			} else {
				result = exportTopLevelElements(
					child,
					byType.element,
					textFormatTransformers,
					byType.textMatch
				)!
			}

			if (result != null) {
				output.push(
					// seperate consecutive group of texts with a line break: eg. ["hello", "world"] -> ["hello", "/nworld"]
					isNewlineDelimited &&
						i > 0 &&
						!$isEmptyParagraph(child) &&
						!$isEmptyParagraph(children[i - 1])
						? '\n'.concat(result)
						: result
				)
			}
		}
		// Ensure consecutive groups of texts are atleast \n\n apart while each empty paragraph render as a newline.
		// Eg. ["hello", "", "", "hi", "\nworld"] -> "hello\n\n\nhi\n\nworld"
		return output.join('\n')
	}
}

export function $convertToMarkdownString(
	transformers: Array<Transformer>,
	node?: ElementNode,
	shouldPreserveNewLines: boolean = false
): string {
	const exportMarkdown = createMarkdownExport(transformers, shouldPreserveNewLines)

	return exportMarkdown(node)
}

function exportTopLevelElements(
	node: LexicalNode,
	elementTransformers: Array<ElementTransformer>,
	textTransformersIndex: Array<TextFormatTransformer>,
	textMatchTransformers: Array<TextMatchTransformer>
): string | null {
	for (const transformer of elementTransformers) {
		const result = transformer.export(node, _node =>
			exportChildren(_node, textTransformersIndex, textMatchTransformers)
		)

		if (result != null) {
			return result
		}
	}

	if ($isMermaidNode(node)) {
		return outputMermaid(node as MermaidNode)
	} else if ($isNavigationNode(node)) {
		return outputNavigation(node as NavigationNode)
	} else if ($isElementNode(node)) {
		return exportChildren(node, textTransformersIndex, textMatchTransformers)
	} else if ($isDecoratorNode(node)) {
		return node.getTextContent()
	} else if ($isTextNode(node)) {
		return exportTextFormat(node, node.getTextContent(), textTransformersIndex)
	} else {
		return null
	}
}

function outputMermaid(node: MermaidNode) {
	return `\`\`\`mermaid
${node.__value}
\`\`\``
}

function outputNavigation(node: NavigationNode) {
	let max_value = 7

	node.__items.forEach(item => {
		const [, , type] = item
		const type_value = parseInt(type.replace('h', ''))

		if (type_value < max_value) max_value = type_value
	})

	const target = node.__items
		.map(([_, title, type]) => {
			const type_value = parseInt(type.replace('h', ''))
			const padding_value = type_value - max_value

			const padding = Array.from({ length: padding_value }, _ => '    ')
			const target_title = title.replace(/\s/g, '')

			return padding + '- ' + `[${target_title}](#${target_title})`
		})
		.join('\n')

	return target
}

function exportChildren(
	node: ElementNode,
	textTransformersIndex: Array<TextFormatTransformer>,
	textMatchTransformers: Array<TextMatchTransformer>
): string {
	const output = []
	const children = node.getChildren()

	mainLoop: for (const child of children) {
		for (const transformer of textMatchTransformers) {
			if (!transformer.export) {
				continue
			}

			const result = transformer.export(
				child,
				parentNode => exportChildren(parentNode, textTransformersIndex, textMatchTransformers),
				(textNode, textContent) => exportTextFormat(textNode, textContent, textTransformersIndex)
			)

			if (result != null) {
				output.push(result)
				continue mainLoop
			}
		}

		if ($isLineBreakNode(child)) {
			output.push('\n')
		} else if ($isMermaidNode(child)) {
			output.push(outputMermaid(child as MermaidNode))
		} else if ($isNavigationNode(child)) {
			output.push(outputNavigation(child as NavigationNode))
		} else if ($isTextNode(child)) {
			output.push(exportTextFormat(child, child.getTextContent(), textTransformersIndex))
		} else if ($isElementNode(child)) {
			// empty paragraph returns ""
			output.push(exportChildren(child, textTransformersIndex, textMatchTransformers))
		} else if ($isDecoratorNode(child)) {
			output.push(child.getTextContent())
		}
	}

	return output.join('')
}

function exportTextFormat(node: TextNode, textContent: string, textTransformers: Array<TextFormatTransformer>): string {
	// This function handles the case of a string looking like this: "   foo   "
	// Where it would be invalid markdown to generate: "**   foo   **"
	// We instead want to trim the whitespace out, apply formatting, and then
	// bring the whitespace back. So our returned string looks like this: "   **foo**   "
	const frozenString = textContent.trim()
	let output = frozenString

	const applied = new Set()

	for (const transformer of textTransformers) {
		const format = transformer.format[0]
		const tag = transformer.tag

		if (hasFormat(node, format) && !applied.has(format)) {
			// Multiple tags might be used for the same format (*, _)
			applied.add(format)
			// Prevent adding opening tag is already opened by the previous sibling
			const previousNode = getTextSibling(node, true)

			if (!hasFormat(previousNode, format)) {
				output = tag + output
			}

			// Prevent adding closing tag if next sibling will do it
			const nextNode = getTextSibling(node, false)

			if (!hasFormat(nextNode, format)) {
				output += tag
			}
		}
	}

	// Replace trimmed version of textContent ensuring surrounding whitespace is not modified
	return textContent.replace(frozenString, () => output)
}

// Get next or previous text sibling a text node, including cases
// when it's a child of inline element (e.g. link)
function getTextSibling(node: TextNode, backward: boolean): TextNode | null {
	let sibling = backward ? node.getPreviousSibling() : node.getNextSibling()

	if (!sibling) {
		const parent = node.getParentOrThrow()

		if (parent.isInline()) {
			sibling = backward ? parent.getPreviousSibling() : parent.getNextSibling()
		}
	}

	while (sibling) {
		if ($isElementNode(sibling)) {
			if (!sibling.isInline()) {
				break
			}

			const descendant = backward ? sibling.getLastDescendant() : sibling.getFirstDescendant()

			if ($isTextNode(descendant)) {
				return descendant
			} else {
				sibling = backward ? sibling.getPreviousSibling() : sibling.getNextSibling()
			}
		}

		if ($isTextNode(sibling)) {
			return sibling
		}

		if (!$isElementNode(sibling)) {
			return null
		}
	}

	return null
}

function hasFormat(node: LexicalNode | null | undefined, format: TextFormatType): boolean {
	return $isTextNode(node) && node.hasFormat(format)
}
