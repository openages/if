import {
	$createLineBreakNode,
	$createParagraphNode,
	$createTabNode,
	$isTabNode,
	$isTextNode,
	ElementNode
} from 'lexical'

import {
	$createCodeNode,
	$createCodeTextNode,
	$isCodeNode,
	$isCodeTextNode,
	convertCodeElement,
	getFirstCodeNodeOfLine
} from './utils'

import type { IPropsCode, SerializedCodeNode } from './types'
import type { BundledLanguage } from 'shiki'
import type { DOMExportOutput, EditorConfig, RangeSelection, DOMConversionMap } from 'lexical'

export default class CodeNode extends ElementNode {
	__lang: BundledLanguage

	static getType() {
		return 'code'
	}

	static clone(node: CodeNode): CodeNode {
		return new CodeNode({ lang: node.__lang, node_key: node.__key })
	}

	static importJSON(serializedNode: SerializedCodeNode): CodeNode {
		const node = $createCodeNode({ lang: serializedNode.lang })

		node.setFormat(serializedNode.format)
		node.setIndent(serializedNode.indent)
		node.setDirection(serializedNode.direction)

		return node
	}

	static importDOM(): DOMConversionMap {
		return { code: () => ({ conversion: convertCodeElement, priority: 0 }) }
	}

	constructor(props: IPropsCode) {
		const { lang, node_key } = props

		super(node_key)

		this.__lang = lang
	}

	createDOM() {
		const element = document.createElement('code')

		element.setAttribute('spellcheck', 'false')
		element.setAttribute('lexical-code-lang', this.__lang)

		return element
	}

	updateDOM(prevNode: CodeNode, dom: HTMLElement, config: EditorConfig): boolean {
		const lang = this.__lang
		const prevLanguage = prevNode.__lang

		if (lang) {
			if (lang !== prevLanguage) {
				dom.setAttribute('lexical-code-lang', lang)
			}
		} else if (prevLanguage) {
			dom.removeAttribute('lexical-code-lang')
		}
		return false
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('pre')

		element.setAttribute('spellcheck', 'false')
		element.setAttribute('lexical-code-lang', this.__lang)

		return { element }
	}

	exportJSON(): SerializedCodeNode {
		return {
			...super.exportJSON(),
			type: 'code',
			lang: this.__lang
		}
	}

	insertNewAfter(selection: RangeSelection, restoreSelection = true) {
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

		const { anchor, focus } = selection
		const firstPoint = anchor.isBefore(focus) ? anchor : focus
		const firstSelectionNode = firstPoint.getNode()

		if ($isTextNode(firstSelectionNode)) {
			let node = getFirstCodeNodeOfLine(firstSelectionNode)
			const insertNodes = []

			while (true) {
				if ($isTabNode(node)) {
					insertNodes.push($createTabNode())
					node = node.getNextSibling()
				} else if ($isCodeTextNode(node)) {
					let spaces = 0
					const text = node.getTextContent()
					const textSize = node.getTextContentSize()
					while (spaces < textSize && text[spaces] === ' ') {
						spaces++
					}
					if (spaces !== 0) {
						insertNodes.push($createCodeTextNode({ text: ' '.repeat(spaces) }))
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
			const target = firstSelectionNode as CodeNode

			target.splice(offset, 0, [$createLineBreakNode()])
			target.select(offset + 1, offset + 1)
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
}
