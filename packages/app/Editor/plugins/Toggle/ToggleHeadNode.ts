import {
	$createParagraphNode,
	$isElementNode,
	DOMConversionMap,
	ElementNode,
	RangeSelection,
	SerializedElementNode
} from 'lexical'

import { $createToggleHeadNode, convertToggleTitleElement } from './utils'

import type ToggleNode from './ToggleNode'
import type ToggleBodyNode from './ToggleBodyNode'

export default class ToggleHeadNode extends ElementNode {
	static getType() {
		return 'toggle_title'
	}

	static clone(node: ToggleHeadNode) {
		return new ToggleHeadNode(node.__key)
	}

	static importDOM(): DOMConversionMap | null {
		return { summary: () => ({ conversion: convertToggleTitleElement, priority: 0 }) }
	}

	static importJSON() {
		return $createToggleHeadNode()
	}

	createDOM(): HTMLElement {
		const el = document.createElement('summary')

		el.classList.add('__editor_toggle_title')

		return el
	}

	updateDOM() {
		return false
	}

	exportJSON(): SerializedElementNode {
		return {
			...super.exportJSON(),
			type: 'toggle_title'
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
