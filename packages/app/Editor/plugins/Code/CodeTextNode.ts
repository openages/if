import { TextNode } from 'lexical'

import { $createCodeNode, $createCodeTextNode } from './utils'

import type { IPropsCodeText, SerializedCodeTextNode } from './types'
import type { EditorConfig } from 'lexical'

export default class CodeTextNode extends TextNode {
	__color: string

	constructor(props: IPropsCodeText) {
		const { text, color, node_key } = props

		super(text, node_key)

		this.__color = color
	}

	static getType(): string {
		return 'code_text'
	}

	static clone(node: CodeTextNode) {
		return new CodeTextNode({ text: node.__text, color: node.__color, node_key: node.__key })
	}

	static importJSON(serializedNode: SerializedCodeTextNode) {
		return $createCodeTextNode({ text: serializedNode.text, color: serializedNode.color })
	}

	createDOM(config: EditorConfig): HTMLElement {
		const element = super.createDOM(config)

		element.style.color = this.__color

		return element
	}

	updateDOM(prev: CodeTextNode, dom: HTMLElement, config: EditorConfig): boolean {
		return super.updateDOM(prev, dom, config)
	}

	exportJSON() {
		return {
			...super.exportJSON(),
			type: 'code_text',
			color: this.__color
		}
	}

	canHaveFormat() {
		return false
	}

	setFormat() {
		return this
	}

	isParentRequired() {
		return true
	}

	createParentElementNode() {
		return $createCodeNode({ lang: 'js' })
	}
}
