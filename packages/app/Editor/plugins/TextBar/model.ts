import { $getSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical'
import { makeAutoObservable } from 'mobx'

import { mergeRegister } from '@lexical/utils'

import type { LexicalEditor } from 'lexical'

export default class Index {
	editor = null as LexicalEditor
	markdown = false

	visible = false
	position = null as { x: number; y: number }
	type = null as 'bold' | 'italic' | 'strikethrough' | 'underline' | 'code'

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { editor: false, markdown: false, unregister: false }, { autoBind: true })
	}

	init(editor: Index['editor'], markdown: boolean) {
		this.editor = editor
		this.markdown = markdown

		this.register()
	}

	reset() {
		this.visible = false
		this.position = null

		return false
	}

	show() {
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

					this.show()

					return false
				},
				COMMAND_PRIORITY_CRITICAL
			),
			this.editor.registerUpdateListener(() => {
				this.show()
			})
		)
	}

	off() {
		this.unregister()
	}
}
