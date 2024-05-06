import { $getSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical'
import { makeAutoObservable } from 'mobx'

import { mergeRegister } from '@lexical/utils'

import type { LexicalEditor } from 'lexical'
import type { LinkNode } from '@lexical/link'

export default class Index {
	editor = null as LexicalEditor
	node = null as LinkNode
	dom = null as HTMLAnchorElement

	visible = false
	position = null as { x: number; y: number }
	link = ''

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { editor: false, node: false, dom: false, unregister: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.register()
	}

	reset() {
		this.node = null
		this.dom = null

		this.visible = false
		this.position = null
		this.link = ''

		return false
	}

	show() {
		if (!this.link) return

		const selection = $getSelection()
		const native_selection = window.getSelection()
		const active_element = document.activeElement
		const root = this.editor.getRootElement()

		if (
			selection !== null &&
			native_selection !== null &&
			root !== null &&
			root.contains(native_selection.anchorNode) &&
			this.editor.isEditable()
		) {
			const rect = native_selection.focusNode?.parentElement?.getBoundingClientRect()

			if (rect) {
				this.visible = true
				this.position = { x: rect.x, y: rect.y + rect.height }
			}
		} else if (!active_element) {
			this.reset()
		}
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.editor = active_editor

					return false
				},
				COMMAND_PRIORITY_CRITICAL
			)
		)
	}

	off() {
		this.unregister()
	}
}
