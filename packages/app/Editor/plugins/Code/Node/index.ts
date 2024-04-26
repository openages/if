import {
	$createLineBreakNode,
	$createParagraphNode,
	$createTabNode,
	$isTabNode,
	$isTextNode as $isLexicalTextNode,
	ElementNode
} from 'lexical'

import {
	$createCodeNode,
	$createTextNode,
	$isCodeNode,
	$isTextNode,
	convertCodeElement,
	getCodeNodeOfLine
} from '../utils'

import type { IPropsCode, SerializedCodeNode } from '../types'
import type { BundledLanguage } from 'shiki'
import type { DOMConversionMap, DOMExportOutput, RangeSelection } from 'lexical'

export default class CodeNode extends ElementNode {
	__value: string
	__lang: BundledLanguage

	constructor(props: IPropsCode) {
		super(props.node_key)

		const { value, lang } = props

		this.__value = value
		this.__lang = lang || 'js'
	}

	static getType() {
		return 'code'
	}

	static clone(node: CodeNode) {
		return new CodeNode({ value: node.__value, lang: node.__lang, node_key: node.__key })
	}

	static importJSON(serializedNode: SerializedCodeNode) {
		return $createCodeNode(serializedNode)
	}

	static importDOM(): DOMConversionMap | null {
		return { code: _ => ({ conversion: convertCodeElement, priority: 0 }) }
	}

	exportJSON() {
		return {
			type: 'code',
			value: this.__value,
			lang: this.__lang
		} as SerializedCodeNode
	}

	createDOM() {
		const el = document.createElement('code')

		el.spellcheck = false

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('pre')

		element.setAttribute('data-lexical-code', btoa(this.__value))
		element.setAttribute('data-lexical-lang', this.__lang)

		return { element }
	}

	updateDOM() {
		return false
	}

	insertNewAfter(selection: RangeSelection, restore_selection = true) {
		const children = this.getChildren()
		const children_length = children.length

		if (
			children_length >= 2 &&
			children[children_length - 1].getTextContent() === '\n' &&
			children[children_length - 2].getTextContent() === '\n' &&
			selection.isCollapsed() &&
			selection.anchor.key === this.__key &&
			selection.anchor.offset === children_length
		) {
			children[children_length - 1].remove()
			children[children_length - 2].remove()

			const new_node = $createParagraphNode()

			this.insertAfter(new_node, restore_selection)

			return new_node
		}

		const { anchor, focus } = selection
		const first_point = anchor.isBefore(focus) ? anchor : focus
		const first_selection_node = first_point.getNode()

		if ($isLexicalTextNode(first_selection_node)) {
			let node = getCodeNodeOfLine('first', first_selection_node)

			const insert_nodes = []

			while (true) {
				if ($isTabNode(node)) {
					insert_nodes.push($createTabNode())
					node = node.getNextSibling()
				} else if ($isTextNode(node)) {
					let spaces = 0

					const text = node.getTextContent()
					const textSize = node.getTextContentSize()

					while (spaces < textSize && text[spaces] === ' ') {
						spaces++
					}

					if (spaces !== 0) {
						insert_nodes.push($createTextNode({ text: ' '.repeat(spaces) }))
					}

					if (spaces !== textSize) {
						break
					}

					node = node.getNextSibling()
				} else {
					break
				}
			}

			const split = first_selection_node.splitText(anchor.offset)[0]
			const x = anchor.offset === 0 ? 0 : 1
			const index = split.getIndexWithinParent() + x
			const code_node = first_selection_node.getParentOrThrow()
			const nodes_to_insert = [$createLineBreakNode(), ...insert_nodes]

			code_node.splice(index, 0, nodes_to_insert)

			const last = insert_nodes[insert_nodes.length - 1]

			if (last) {
				last.select()
			} else if (anchor.offset === 0) {
				split.selectPrevious()
			} else {
				split.getNextSibling()!.selectNext(0, 0)
			}
		}

		if ($isCodeNode(first_selection_node)) {
			const { offset } = selection.anchor
			const selection_node = first_selection_node as ElementNode

			selection_node.splice(offset, 0, [$createLineBreakNode()])
			selection_node.select(offset + 1, offset + 1)
		}

		return null
	}
}
