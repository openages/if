import { TextNode as _TextNode } from 'lexical'

import { $createTextNode } from '../utils'

import type { EditorConfig } from 'lexical'
import type { IPropsText, SerializedTextNode } from '../types'

export default class TextNode extends _TextNode {
	__styles: string

	constructor(props: IPropsText) {
		super(props.text, props.node_key)

		const { styles } = props

		this.__styles = styles
	}

	static getType(): string {
		return 'code_text'
	}

	static clone(node: TextNode) {
		return new TextNode({ text: node.__text, styles: node.__styles, node_key: node.__key })
	}

	static importJSON(serializedNode: SerializedTextNode) {
		return $createTextNode(serializedNode)
	}

	createDOM(config: EditorConfig) {
		const el = super.createDOM(config)

		el.style.cssText = this.__styles

		return el
	}

	updateDOM(prev_node: TextNode, dom: HTMLElement, config: EditorConfig) {
		return super.updateDOM(prev_node, dom, config)
	}

	exportJSON(): SerializedTextNode {
		return {
			type: 'code_text',
			styles: this.__styles,
			...super.exportJSON()
		}
	}
}
