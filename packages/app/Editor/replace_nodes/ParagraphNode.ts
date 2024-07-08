import { ParagraphNode } from 'lexical'

import type { Spread, SerializedElementNode } from 'lexical'

export type SerializedParagraphNode = Spread<
	{
		key: string
		textFormat: number
	},
	SerializedElementNode
>

export default class P extends ParagraphNode {
	static getType() {
		return 'p'
	}

	static clone(node: P): ParagraphNode {
		return new P(node.__key)
	}

	static importJSON(serializedNode: SerializedParagraphNode): ParagraphNode {
		const node = new P(serializedNode.key)

		node.setFormat(serializedNode.format)
		node.setIndent(serializedNode.indent)
		node.setDirection(serializedNode.direction)
		node.setTextFormat(serializedNode.textFormat)

		return node
	}

	exportJSON(): SerializedParagraphNode {
		return {
			...super.exportJSON(),
			type: 'paragraph',
			key: this.__key,
			version: 1,
			textFormat: this.getTextFormat()
		}
	}
}
