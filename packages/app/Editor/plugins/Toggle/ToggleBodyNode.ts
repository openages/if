import { ElementNode } from 'lexical'

import { $createToggleBodyNode, convertToggleBodyElement } from './utils'

import type { DOMConversionMap, DOMExportOutput, SerializedElementNode } from 'lexical'

export default class ToggleBodyNode extends ElementNode {
	static getType() {
		return 'toggle_body'
	}

	static clone(node: ToggleBodyNode) {
		return new ToggleBodyNode(node.__key)
	}

	static importDOM(): DOMConversionMap {
		return {
			div: (dom: HTMLElement) => {
				if (!dom.hasAttribute('lexical-toggle-body')) return

				return {
					conversion: convertToggleBodyElement,
					priority: 2
				}
			}
		}
	}

	static importJSON() {
		return $createToggleBodyNode()
	}

	createDOM() {
		const el = document.createElement('div')

		el.classList.add('__editor_toggle_body')

		return el
	}

	exportDOM(): DOMExportOutput {
		const el = document.createElement('div')

		el.classList.add('__editor_toggle_body')
		el.setAttribute('lexical-toggle-body', 'true')

		return { element: el }
	}

	updateDOM() {
		return false
	}

	exportJSON(): SerializedElementNode {
		return {
			...super.exportJSON(),
			type: 'toggle_body'
		}
	}

	isShadowRoot() {
		return true
	}
}
