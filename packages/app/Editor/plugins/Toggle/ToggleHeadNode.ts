import { $createParagraphNode, $isElementNode, ElementNode } from 'lexical'

import { $createToggleHeadNode, convertToggleHeadElement } from './utils'

import type ToggleNode from './ToggleNode'
import type { DOMConversionMap, RangeSelection, SerializedElementNode } from 'lexical'
import type ToggleBodyNode from './ToggleBodyNode'

export default class ToggleHeadNode extends ElementNode {
	static getType() {
		return 'toggle_head'
	}

	static clone(node: ToggleHeadNode) {
		return new ToggleHeadNode(node.__key)
	}

	static importDOM(): DOMConversionMap | null {
		return { div: () => ({ conversion: convertToggleHeadElement, priority: 0 }) }
	}

	static importJSON() {
		return $createToggleHeadNode()
	}

	createDOM(): HTMLElement {
		const el = document.createElement('div')

		el.classList.add('__editor_toggle_head')

		return el
	}

	updateDOM() {
		return false
	}

	exportJSON(): SerializedElementNode {
		return {
			...super.exportJSON(),
			type: 'toggle_head'
		}
	}

	collapseAtStart() {
		this.getParentOrThrow().insertBefore(this)

		return true
	}

	insertNewAfter(_: RangeSelection, restore_selection = true): ElementNode {
		const container = this.getParentOrThrow() as ToggleNode

		if (container.getLatest().__open) {
			const content = this.getNextSibling() as ToggleBodyNode
			const first = content.getFirstChild()

			if ($isElementNode(first)) {
				return first
			} else {
				const p = $createParagraphNode()

				content.append(p)

				return p
			}
		} else {
			const p = $createParagraphNode()

			container.insertAfter(p, restore_selection)

			return p
		}
	}
}
