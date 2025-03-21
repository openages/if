import {
	$createLineBreakNode,
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	$getSelection,
	$isParagraphNode,
	ElementNode
} from 'lexical'

import { IS_APPLE_WEBKIT, IS_IOS, IS_SAFARI } from '@/utils/environment'
import { $isListItemNode, $isListNode, ListItemNode } from '@lexical/list'
import { $findMatchingParent } from '@lexical/utils'

import { $createCodeNode, $createCodeTextNode } from '../plugins/Code/utils'
import { $createMermaidNode } from '../plugins/Mermaid/utils'
import {
	$isEmptyParagraph,
	transformersByType,
	CODE_BLOCK_REG_EXP,
	MERMAID_BLOCK_REG_EXP,
	PUNCTUATION_OR_SPACE,
	QUOTE_BLOCK_REG_EXP,
	TOGGLE_END_BLOCK_REG_EXP,
	TOGGLE_START_BLOCK_REG_EXP
} from './'

import type { ElementTransformer, TextFormatTransformer, TextMatchTransformer, Transformer } from '@lexical/markdown'
import type { LexicalNode, TextNode } from 'lexical'
import type { BundledLanguage } from 'shiki'

type TextFormatTransformersIndex = Readonly<{
	fullMatchRegExpByTag: Readonly<Record<string, RegExp>>
	openTagsRegExp: RegExp
	transformersByTag: Readonly<Record<string, TextFormatTransformer>>
}>

interface Options {
	import?: boolean
}

export function createMarkdownImport(
	transformers: Array<Transformer>,
	shouldPreserveNewLines = false,
	options?: Options
): (markdownString: string, node?: ElementNode) => void {
	const byType = transformersByType(transformers)
	const textFormatTransformersIndex = createTextFormatTransformersIndex(byType.textFormat)

	return (markdownString, node) => {
		const lines = markdownString.split('\n')
		const linesLength = lines.length
		const root = node || $getRoot()

		root.clear()

		for (let i = 0; i < linesLength; i++) {
			const lineText = lines[i]

			const [code_node, code_index] = $importCodeBlock(lines, i, root)

			if (code_node) {
				i = code_index

				continue
			}

			const [mermaid_node, mermaid_index] = $importMermaidBlock(lines, i, root)

			if (mermaid_node) {
				i = mermaid_index

				continue
			}

			const [quote_text, quote_index] = $importQuoteBlock(lines, i)

			if (quote_text) {
				i = quote_index

				$importBlocks(quote_text, root, byType.element, textFormatTransformersIndex, byType.textMatch)

				continue
			}

			const [toggle_text, toggle_index] = $importToggleBlock(lines, i)

			if (toggle_text) {
				i = toggle_index

				$importBlocks(toggle_text, root, byType.element, textFormatTransformersIndex, byType.textMatch)

				continue
			}

			$importBlocks(lineText, root, byType.element, textFormatTransformersIndex, byType.textMatch)
		}

		const children = root.getChildren()

		for (const child of children) {
			if (!shouldPreserveNewLines && $isEmptyParagraph(child) && root.getChildrenSize() > 1) {
				child.remove()
			}
		}

		if ($getSelection() !== null && options?.import) {
			root.selectStart()
		}
	}
}

export function $convertFromMarkdownString(
	markdown: string,
	transformers: Array<Transformer>,
	node?: ElementNode,
	shouldPreserveNewLines = false,
	options?: Options
): void {
	const importMarkdown = createMarkdownImport(transformers, shouldPreserveNewLines, options)

	return importMarkdown(markdown, node)
}

export function $convertFromPasteString(markdown: string, transformers: Array<Transformer>) {
	const byType = transformersByType(transformers)
	const textFormatTransformersIndex = createTextFormatTransformersIndex(byType.textFormat)
	const lines = markdown.split('\n')
	const linesLength = lines.length
	const nodes = [] as Array<LexicalNode>

	for (let i = 0; i < linesLength; i++) {
		const lineText = lines[i]

		const [code_node, code_index] = $importCodeBlock(lines, i)

		if (code_node) {
			nodes.push(code_node)

			i = code_index

			continue
		}

		const [mermaid_node, mermaid_index] = $importMermaidBlock(lines, i)

		if (mermaid_node) {
			nodes.push(mermaid_node)

			i = mermaid_index

			continue
		}

		const [quote_text, quote_index] = $importQuoteBlock(lines, i)

		if (quote_text) {
			i = quote_index

			const element = $importBlocks(
				quote_text,
				undefined,
				byType.element,
				textFormatTransformersIndex,
				byType.textMatch
			)

			nodes.push(element)

			continue
		}

		const [toggle_text, toggle_index] = $importToggleBlock(lines, i)

		if (toggle_text) {
			i = toggle_index

			const element = $importBlocks(
				toggle_text,
				undefined,
				byType.element,
				textFormatTransformersIndex,
				byType.textMatch
			)

			nodes.push(element)

			continue
		}

		const element = $importBlocks(
			lineText,
			undefined,
			byType.element,
			textFormatTransformersIndex,
			byType.textMatch
		)

		nodes.push(element)
	}

	for (const node of nodes) {
		if ($isEmptyParagraph(node)) {
			node.remove()
		}
	}

	return nodes
}

function $importBlocks(
	lineText: string,
	rootNode: ElementNode | undefined,
	elementTransformers: Array<ElementTransformer>,
	textFormatTransformersIndex: TextFormatTransformersIndex,
	textMatchTransformers: Array<TextMatchTransformer>
) {
	const textNode = $createTextNode(lineText)
	const elementNode = $createParagraphNode()

	elementNode.append(textNode)

	if (rootNode) rootNode.append(elementNode)

	for (const { regExp, replace } of elementTransformers) {
		const match = lineText.match(regExp)

		if (match) {
			textNode.setTextContent(lineText.slice(match[0].length))
			replace(elementNode, [textNode], match, true)
			break
		}
	}

	importTextFormatTransformers(textNode, textFormatTransformersIndex, textMatchTransformers)

	if (elementNode.isAttached() && lineText.length > 0) {
		const previousNode = elementNode.getPreviousSibling()

		if ($isParagraphNode(previousNode) || $isListNode(previousNode)) {
			let targetNode: typeof previousNode | ListItemNode | null = previousNode

			if ($isListNode(previousNode)) {
				const lastDescendant = previousNode.getLastDescendant()

				if (lastDescendant == null) {
					targetNode = null
				} else {
					targetNode = $findMatchingParent(lastDescendant, $isListItemNode)
				}
			}

			if (targetNode != null && targetNode.getTextContentSize() > 0) {
				targetNode.splice(targetNode.getChildrenSize(), 0, [
					$createLineBreakNode(),
					...elementNode.getChildren()
				])

				elementNode.remove()
			}
		}
	}

	return elementNode
}

function $importCodeBlock(
	lines: Array<string>,
	startLineIndex: number,
	rootNode?: ElementNode
): [LexicalNode | null, number] {
	const openMatch = lines[startLineIndex].match(CODE_BLOCK_REG_EXP)

	if (openMatch) {
		let endLineIndex = startLineIndex
		const linesLength = lines.length

		while (++endLineIndex < linesLength) {
			const closeMatch = lines[endLineIndex].match(CODE_BLOCK_REG_EXP)

			if (closeMatch) {
				const codeBlockNode = $createCodeNode({ lang: openMatch[1] as BundledLanguage })

				codeBlockNode.appendTextToTokens(lines.slice(startLineIndex + 1, endLineIndex).join('\n'))

				if (rootNode) rootNode.append(codeBlockNode)

				return [codeBlockNode, endLineIndex]
			}
		}
	}

	return [null, startLineIndex]
}

function $importMermaidBlock(
	lines: Array<string>,
	startLineIndex: number,
	rootNode?: ElementNode
): [LexicalNode | null, number] {
	const openMatch = lines[startLineIndex].match(MERMAID_BLOCK_REG_EXP)

	if (openMatch) {
		let endLineIndex = startLineIndex
		const linesLength = lines.length

		while (++endLineIndex < linesLength) {
			const closeMatch = lines[endLineIndex].match(CODE_BLOCK_REG_EXP)

			if (closeMatch) {
				const mermaid_node = $createMermaidNode({
					value: lines.slice(startLineIndex + 1, endLineIndex).join('\n')
				})

				if (rootNode) rootNode.append(mermaid_node)

				return [mermaid_node, endLineIndex]
			}
		}
	}

	return [null, startLineIndex]
}

function $importQuoteBlock(lines: Array<string>, startLineIndex: number): [string | null, number] {
	const openMatch = lines[startLineIndex].match(QUOTE_BLOCK_REG_EXP)

	if (openMatch) {
		let endLineIndex = startLineIndex

		const linesLength = lines.length

		while (++endLineIndex < linesLength) {
			const closeMatch = lines[endLineIndex].match(QUOTE_BLOCK_REG_EXP)

			if (!closeMatch) {
				const text =
					lines[startLineIndex] +
					'\n' +
					lines
						.slice(startLineIndex + 1, endLineIndex)
						.map(item => item.replace('> ', ''))
						.join('\n') +
					'\n'

				return [text, endLineIndex]
			}
		}
	}

	return [null, startLineIndex]
}

function $importToggleBlock(lines: Array<string>, startLineIndex: number): [string | null, number] {
	const openMatch = lines[startLineIndex].match(TOGGLE_START_BLOCK_REG_EXP)

	if (openMatch) {
		let endLineIndex = startLineIndex

		const linesLength = lines.length

		while (++endLineIndex < linesLength) {
			const closeMatch = lines[endLineIndex].match(TOGGLE_END_BLOCK_REG_EXP)

			if (closeMatch) {
				const text = lines[startLineIndex] + lines.slice(startLineIndex + 1, endLineIndex).join('\n')

				return [text, endLineIndex]
			}
		}
	}

	return [null, startLineIndex]
}

function importTextFormatTransformers(
	textNode: TextNode,
	textFormatTransformersIndex: TextFormatTransformersIndex,
	textMatchTransformers: Array<TextMatchTransformer>
) {
	const textContent = textNode.getTextContent()
	const match = findOutermostMatch(textContent, textFormatTransformersIndex)

	if (!match) {
		// Once text format processing is done run text match transformers, as it
		// only can span within single text node (unline formats that can cover multiple nodes)
		importTextMatchTransformers(textNode, textMatchTransformers)
		return
	}

	let currentNode, remainderNode, leadingNode

	// If matching full content there's no need to run splitText and can reuse existing textNode
	// to update its content and apply format. E.g. for **_Hello_** string after applying bold
	// format (**) it will reuse the same text node to apply italic (_)
	if (match[0] === textContent) {
		currentNode = textNode
	} else {
		const startIndex = match.index || 0
		const endIndex = startIndex + match[0].length

		if (startIndex === 0) {
			;[currentNode, remainderNode] = textNode.splitText(endIndex)
		} else {
			;[leadingNode, currentNode, remainderNode] = textNode.splitText(startIndex, endIndex)
		}
	}

	currentNode.setTextContent(match[2])
	const transformer = textFormatTransformersIndex.transformersByTag[match[1]]

	if (transformer) {
		for (const format of transformer.format) {
			if (!currentNode.hasFormat(format)) {
				currentNode.toggleFormat(format)
			}
		}
	}

	if (!currentNode.hasFormat('code')) {
		importTextFormatTransformers(currentNode, textFormatTransformersIndex, textMatchTransformers)
	}

	if (leadingNode) {
		importTextFormatTransformers(leadingNode, textFormatTransformersIndex, textMatchTransformers)
	}

	if (remainderNode) {
		importTextFormatTransformers(remainderNode, textFormatTransformersIndex, textMatchTransformers)
	}
}

function importTextMatchTransformers(textNode_: TextNode, textMatchTransformers: Array<TextMatchTransformer>) {
	let textNode = textNode_

	mainLoop: while (textNode) {
		for (const transformer of textMatchTransformers) {
			if (!transformer.replace || !transformer.importRegExp) {
				continue
			}

			const match = textNode.getTextContent().match(transformer.importRegExp)

			if (!match) {
				continue
			}

			const startIndex = match.index || 0
			const endIndex = startIndex + match[0].length
			let replaceNode, newTextNode

			if (startIndex === 0) {
				;[replaceNode, textNode] = textNode.splitText(endIndex)
			} else {
				;[, replaceNode, newTextNode] = textNode.splitText(startIndex, endIndex)
			}

			if (newTextNode) {
				importTextMatchTransformers(newTextNode, textMatchTransformers)
			}
			transformer.replace(replaceNode, match)
			continue mainLoop
		}

		break
	}
}

// Finds first "<tag>content<tag>" match that is not nested into another tag
function findOutermostMatch(
	textContent: string,
	textTransformersIndex: TextFormatTransformersIndex
): RegExpMatchArray | null {
	const openTagsMatch = textContent.match(textTransformersIndex.openTagsRegExp)

	if (openTagsMatch == null) {
		return null
	}

	for (const match of openTagsMatch) {
		// Open tags reg exp might capture leading space so removing it
		// before using match to find transformer
		const tag = match.replace(/^\s/, '')
		const fullMatchRegExp = textTransformersIndex.fullMatchRegExpByTag[tag]

		if (fullMatchRegExp == null) {
			continue
		}

		const fullMatch = textContent.match(fullMatchRegExp)
		const transformer = textTransformersIndex.transformersByTag[tag]

		if (fullMatch != null && transformer != null) {
			if (transformer.intraword !== false) {
				return fullMatch
			}

			// For non-intraword transformers checking if it's within a word
			// or surrounded with space/punctuation/newline
			const { index = 0 } = fullMatch
			const beforeChar = textContent[index - 1]
			const afterChar = textContent[index + fullMatch[0].length]

			if (
				(!beforeChar || PUNCTUATION_OR_SPACE.test(beforeChar)) &&
				(!afterChar || PUNCTUATION_OR_SPACE.test(afterChar))
			) {
				return fullMatch
			}
		}
	}

	return null
}

function createTextFormatTransformersIndex(
	textTransformers: Array<TextFormatTransformer>
): TextFormatTransformersIndex {
	const transformersByTag: Record<string, TextFormatTransformer> = {}
	const fullMatchRegExpByTag: Record<string, RegExp> = {}
	const openTagsRegExp = []
	const escapeRegExp = `(?<![\\\\])`

	for (const transformer of textTransformers) {
		const { tag } = transformer
		transformersByTag[tag] = transformer
		const tagRegExp = tag.replace(/(\*|\^|\+)/g, '\\$1')
		openTagsRegExp.push(tagRegExp)

		if (IS_SAFARI || IS_IOS || IS_APPLE_WEBKIT) {
			fullMatchRegExpByTag[tag] = new RegExp(
				`(${tagRegExp})(?![${tagRegExp}\\s])(.*?[^${tagRegExp}\\s])${tagRegExp}(?!${tagRegExp})`
			)
		} else {
			fullMatchRegExpByTag[tag] = new RegExp(
				`(?<![\\\\${tagRegExp}])(${tagRegExp})((\\\\${tagRegExp})?.*?[^${tagRegExp}\\s](\\\\${tagRegExp})?)((?<!\\\\)|(?<=\\\\\\\\))(${tagRegExp})(?![\\\\${tagRegExp}])`
			)
		}
	}

	return {
		// Reg exp to find open tag + content + close tag
		fullMatchRegExpByTag,
		// Reg exp to find opening tags
		openTagsRegExp: new RegExp(
			(IS_SAFARI || IS_IOS || IS_APPLE_WEBKIT ? '' : `${escapeRegExp}`) +
				'(' +
				openTagsRegExp.join('|') +
				')',
			'g'
		),
		transformersByTag
	}
}
