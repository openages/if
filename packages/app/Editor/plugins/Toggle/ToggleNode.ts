import { DOMConversionMap, DOMExportOutput, ElementNode } from 'lexical'

import { $createToggleNode, convertToggleElement } from './utils'

import type { SerializedToggleNode, IPropsToggle } from './types'

export default class ToggleNode extends ElementNode {
	__open: boolean

	constructor(props: IPropsToggle) {
		super(props.node_key)

		this.__open = props.open
	}

	static getType() {
		return 'toggle'
	}

	static clone(node: ToggleNode) {
		return new ToggleNode({ open: node.__open, node_key: node.__key })
	}

	static importDOM(): DOMConversionMap<HTMLDetailsElement> {
		return { details: () => ({ conversion: convertToggleElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedToggleNode) {
		return $createToggleNode({ open: serializedNode.open })
	}

	createDOM(): HTMLElement {
		const el = document.createElement('div')

		el.classList.value = '__editor_toggle __editor_block'

		this.updateClass(el)

		return el
	}

	updateDOM(prev_node: ToggleNode, el: HTMLDivElement) {
		if (prev_node.__open !== this.__open) {
			this.updateClass(el)
		}

		return false
	}

	exportDOM(): DOMExportOutput {
		const el = document.createElement('div')

		el.classList.add('__editor_toggle')

		el.setAttribute('lexical-toggle-open', this.__open.toString())

		return { element: el }
	}

	exportJSON(): SerializedToggleNode {
		return {
			...super.exportJSON(),
			type: 'toggle',
			open: this.__open
		}
	}

	updateClass(el: HTMLDivElement) {
		if (this.__open) {
			el.classList.remove('__editor_toggle_close')
			el.classList.add('__editor_toggle_open')
		} else {
			el.classList.add('__editor_toggle_close')
			el.classList.remove('__editor_toggle_open')
		}
	}

	toggleOpen(v?: boolean) {
		const writable = this.getWritable()

		writable.__open = v ?? !this.__open
	}
}
