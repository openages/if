import { DOMConversionMap, DOMExportOutput, EditorConfig, ElementNode, LexicalEditor } from 'lexical'

import { $createToggleNode, convertToggleElement } from './utils'

import type { SerializedToggleNode, IPropsToggle } from './types'

export default class ToggleNode extends ElementNode {
	__open: boolean

	constructor(props: IPropsToggle) {
		super(props.node_key)

		this.__open = props.open || true
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

	createDOM(_: EditorConfig, editor: LexicalEditor): HTMLElement {
		const dom = document.createElement('details')

		dom.classList.add('__editor_toggle')
		dom.open = this.__open

		this.updateDomClass(dom)

		dom.addEventListener('toggle', () => {
			const open = editor.getEditorState().read(() => this.getLatest().__open)

			this.updateDomClass(dom)

			if (open === dom.open) return

			editor.update(() => this.toggleOpen())
		})

		return dom
	}

	updateDOM(prev_node: ToggleNode, dom: HTMLDetailsElement) {
		if (prev_node.__open !== this.__open) {
			dom.open = this.__open
		}

		return false
	}

	exportDOM(): DOMExportOutput {
		const el = document.createElement('details')

		el.classList.add('__editor_toggle')

		el.setAttribute('open', this.__open.toString())

		return { element: el }
	}

	exportJSON(): SerializedToggleNode {
		return {
			...super.exportJSON(),
			type: 'toggle',
			open: this.__open
		}
	}

	updateDomClass(dom: HTMLDetailsElement) {
		if (dom.open) {
			dom.classList.remove('__editor_toggle_close')
			dom.classList.add('__editor_toggle_open')
		} else {
			dom.classList.add('__editor_toggle_close')
			dom.classList.remove('__editor_toggle_open')
		}
	}

	toggleOpen(v?: boolean) {
		const writable = this.getWritable()

		writable.__open = v ?? !this.getLatest().__open
	}
}
