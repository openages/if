import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	DRAGSTART_COMMAND,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { mergeRegister } from '@lexical/utils'

import { $isImageNode } from '../utils'

import type { LexicalEditor, BaseSelection } from 'lexical'

export default class Index {
	nodeKey = ''
	editor = null as LexicalEditor
	active_editor = null as LexicalEditor
	ref = null as HTMLImageElement

	selection = null as BaseSelection
	selected = false
	mounted = false

	setSelected = null as (v: boolean) => void
	clearSelection = null as () => void
	unregister = null as () => void

	get draggable() {
		return this.selected && $isNodeSelection(this.selection)
	}

	constructor() {
		makeAutoObservable(
			this,
			{
				nodeKey: false,
				editor: false,
				active_editor: false,
				ref: false,
				setSelected: false,
				clearSelection: false,
				onDelete: false,
				onClick: false,
				unregister: false
			},
			{ autoBind: true }
		)
	}

	init(editor: Index['editor'], setSelected: Index['setSelected'], clearSelection: Index['clearSelection']) {
		this.editor = editor
		this.setSelected = setSelected
		this.clearSelection = clearSelection
	}

	onDelete(e: KeyboardEvent) {
		if (this.selected && $isNodeSelection($getSelection())) {
			e.preventDefault()

			const node = $getNodeByKey(this.nodeKey)

			if ($isImageNode(node)) {
				node.remove()

				return true
			}
		}

		return false
	}

	onClick(e: MouseEvent) {
		if (e.target === this.ref) {
			if (e.shiftKey) {
				this.setSelected(!this.selected)
			} else {
				this.clearSelection()
				this.setSelected(true)
			}

			return true
		}

		return false
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerUpdateListener(({ editorState }) => {
				if (!this.mounted) return

				this.selection = editorState.read(() => $getSelection())
			}),
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.active_editor = active_editor

					return false
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand<MouseEvent>(CLICK_COMMAND, this.onClick, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(
				DRAGSTART_COMMAND,
				event => {
					if (event.target === this.ref) {
						event.preventDefault()

						return true
					}
					return false
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(KEY_DELETE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_BACKSPACE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW)
		)
	}

	off() {
		this.unregister()
	}
}
