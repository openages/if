/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CodeHighlightNode } from '@lexical/code'
import type {
	DOMConversionMap,
	DOMConversionOutput,
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	ParagraphNode,
	RangeSelection,
	SerializedElementNode,
	Spread,
	TabNode
} from 'lexical'

import {
	$applyNodeReplacement,
	$createLineBreakNode,
	$createParagraphNode,
	$createTabNode,
	$isTabNode,
	$isTextNode,
	ElementNode
} from 'lexical'

import { addClassNamesToElement, isHTMLElement } from '@lexical/utils'

import { $createCodeHighlightNode, $isCodeHighlightNode, getFirstCodeNodeOfLine } from './CodeHighlightNode'

export type SerializedCodeNode = Spread<
	{
		lang: string | null | undefined
	},
	SerializedElementNode
>

const LANGUAGE_DATA_ATTRIBUTE = 'data-highlight-lang'

export class CodeNode extends ElementNode {
	__lang: string | null | undefined

	static getType(): string {
		return 'code'
	}

	static clone(node: CodeNode): CodeNode {
		return new CodeNode(node.__lang, node.__key)
	}

	constructor(lang?: string | null | undefined, key?: NodeKey) {
		super(key)

		this.__lang = lang
	}

	// View
	createDOM(config: EditorConfig): HTMLElement {
		const element = document.createElement('code')
		addClassNamesToElement(element, config.theme.code)
		element.setAttribute('spellcheck', 'false')
		const lang = this.getLanguage()

		if (lang) {
			element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, lang)
		}

		return element
	}
	updateDOM(prevNode: CodeNode, dom: HTMLElement, config: EditorConfig): boolean {
		const lang = this.__lang
		const prevLanguage = prevNode.__lang

		if (lang) {
			if (lang !== prevLanguage) {
				dom.setAttribute(LANGUAGE_DATA_ATTRIBUTE, lang)
			}
		} else if (prevLanguage) {
			dom.removeAttribute(LANGUAGE_DATA_ATTRIBUTE)
		}
		return false
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const element = document.createElement('pre')
		addClassNamesToElement(element, editor._config.theme.code)
		element.setAttribute('spellcheck', 'false')
		const lang = this.getLanguage()
		if (lang) {
			element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, lang)
		}
		return { element }
	}

	static importDOM(): DOMConversionMap | null {
		return {
			// Typically <pre> is used for code blocks, and <code> for inline code styles
			// but if it's a multi line <code> we'll create a block. Pass through to
			// inline format handled by TextNode otherwise.
			code: (node: Node) => {
				return {
					conversion: convertPreElement,
					priority: 1
				}
			}
		}
	}

	static importJSON(serializedNode: SerializedCodeNode): CodeNode {
		const node = $createCodeNode(serializedNode.lang)
		node.setFormat(serializedNode.format)
		node.setIndent(serializedNode.indent)
		node.setDirection(serializedNode.direction)
		return node
	}

	exportJSON(): SerializedCodeNode {
		return {
			...super.exportJSON(),
			lang: this.getLanguage(),
			type: 'code',
			version: 1
		}
	}

	// Mutation
	insertNewAfter(
		selection: RangeSelection,
		restoreSelection = true
	): null | ParagraphNode | CodeHighlightNode | TabNode {
		const children = this.getChildren()
		const childrenLength = children.length

		if (
			childrenLength >= 2 &&
			children[childrenLength - 1].getTextContent() === '\n' &&
			children[childrenLength - 2].getTextContent() === '\n' &&
			selection.isCollapsed() &&
			selection.anchor.key === this.__key &&
			selection.anchor.offset === childrenLength
		) {
			children[childrenLength - 1].remove()
			children[childrenLength - 2].remove()
			const newElement = $createParagraphNode()
			this.insertAfter(newElement, restoreSelection)
			return newElement
		}

		// If the selection is within the codeblock, find all leading tabs and
		// spaces of the current line. Create a new line that has all those
		// tabs and spaces, such that leading indentation is preserved.
		const { anchor, focus } = selection
		const firstPoint = anchor.isBefore(focus) ? anchor : focus
		const firstSelectionNode = firstPoint.getNode()
		if ($isTextNode(firstSelectionNode)) {
			let node = getFirstCodeNodeOfLine(firstSelectionNode)
			const insertNodes = []
			// eslint-disable-next-line no-constant-condition
			while (true) {
				if ($isTabNode(node)) {
					insertNodes.push($createTabNode())
					node = node.getNextSibling()
				} else if ($isCodeHighlightNode(node)) {
					let spaces = 0
					const text = node.getTextContent()
					const textSize = node.getTextContentSize()
					while (spaces < textSize && text[spaces] === ' ') {
						spaces++
					}
					if (spaces !== 0) {
						insertNodes.push($createCodeHighlightNode(' '.repeat(spaces)))
					}
					if (spaces !== textSize) {
						break
					}
					node = node.getNextSibling()
				} else {
					break
				}
			}
			const split = firstSelectionNode.splitText(anchor.offset)[0]
			const x = anchor.offset === 0 ? 0 : 1
			const index = split.getIndexWithinParent() + x
			const codeNode = firstSelectionNode.getParentOrThrow()
			const nodesToInsert = [$createLineBreakNode(), ...insertNodes]
			codeNode.splice(index, 0, nodesToInsert)
			const last = insertNodes[insertNodes.length - 1]
			if (last) {
				last.select()
			} else if (anchor.offset === 0) {
				split.selectPrevious()
			} else {
				split.getNextSibling()!.selectNext(0, 0)
			}
		}
		if ($isCodeNode(firstSelectionNode)) {
			const { offset } = selection.anchor
			firstSelectionNode.splice(offset, 0, [$createLineBreakNode()])
			firstSelectionNode.select(offset + 1, offset + 1)
		}

		return null
	}

	canIndent(): false {
		return false
	}

	collapseAtStart(): boolean {
		const paragraph = $createParagraphNode()
		const children = this.getChildren()
		children.forEach(child => paragraph.append(child))
		this.replace(paragraph)
		return true
	}

	setColor(lang: string): void {
		const writable = this.getWritable()

		writable.__lang = lang
	}

	getLanguage(): string | null | undefined {
		return this.getLatest().__lang
	}
}

export function $createCodeNode(lang?: string | null | undefined): CodeNode {
	return $applyNodeReplacement(new CodeNode(lang))
}

export function $isCodeNode(node: LexicalNode | null | undefined): node is CodeNode {
	return node instanceof CodeNode
}

function convertPreElement(domNode: Node): DOMConversionOutput {
	let lang
	if (isHTMLElement(domNode)) {
		lang = domNode.getAttribute(LANGUAGE_DATA_ATTRIBUTE)
	}
	return { node: $createCodeNode(lang) }
}

function convertDivElement(domNode: Node): DOMConversionOutput {
	// domNode is a <div> since we matched it by nodeName
	const div = domNode as HTMLDivElement
	const isCode = isCodeElement(div)
	if (!isCode && !isCodeChildElement(div)) {
		return {
			node: null
		}
	}
	return {
		after: childLexicalNodes => {
			const domParent = domNode.parentNode
			if (domParent != null && domNode !== domParent.lastChild) {
				childLexicalNodes.push($createLineBreakNode())
			}
			return childLexicalNodes
		},
		node: isCode ? $createCodeNode() : null
	}
}

function isCodeElement(div: HTMLElement): boolean {
	return div.style.fontFamily.match('monospace') !== null
}

function isCodeChildElement(node: HTMLElement): boolean {
	let parent = node.parentElement
	while (parent !== null) {
		if (isCodeElement(parent)) {
			return true
		}
		parent = parent.parentElement
	}
	return false
}

function isGitHubCodeCell(cell: HTMLTableCellElement): cell is HTMLTableCellElement {
	return cell.classList.contains('js-file-line')
}

function isGitHubCodeTable(table: HTMLTableElement): table is HTMLTableElement {
	return table.classList.contains('js-file-line-container')
}
