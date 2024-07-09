import { $createParagraphNode, ElementNode } from 'lexical'

import { isHTMLElement } from '@dnd-kit/utilities'

import { $convertBlockquoteElement, $createQuoteNode } from './utils'

import type { NodeKey, DOMConversionMap, SerializedElementNode, DOMExportOutput, LexicalEditor } from 'lexical'

export default class QuoteNode extends ElementNode {
	constructor(key?: NodeKey) {
		super(key)
	}

	static getType() {
		return 'quote'
	}

	static clone(node: QuoteNode) {
		return new QuoteNode(node.__key)
	}

	static importDOM(): DOMConversionMap {
		return { blockquote: () => ({ conversion: $convertBlockquoteElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedElementNode) {
		const node = $createQuoteNode(serializedNode.key)

		node.setFormat(serializedNode.format)
		node.setIndent(serializedNode.indent)
		node.setDirection(serializedNode.direction)

		return node
	}

	createDOM(): HTMLElement {
		const el = document.createElement('blockquote')

		el.classList.value = '__editor_quote __editor_block'

		return el
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const { element } = super.exportDOM(editor)

		if (element && isHTMLElement(element)) {
			if (this.isEmpty()) element.append(document.createElement('br'))

			const direction = this.getDirection()
			const align = this.getFormatType()

			if (direction) element.dir = direction
			if (align) element.style.textAlign = align
		}

		return { element }
	}

	exportJSON(): SerializedElementNode {
		return {
			...super.exportJSON(),
			type: 'quote'
		}
	}

	updateDOM() {
		return false
	}

	insertNewAfter() {
		const p = $createParagraphNode()

		this.append(p)

		return p
	}

	collapseAtStart() {
		const p = $createParagraphNode()
		const children = this.getChildren()

		children.forEach(child => p.append(child))

		this.replace(p)

		return true
	}
}
