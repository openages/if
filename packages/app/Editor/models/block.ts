import {
	$createParagraphNode,
	$getSelection,
	$insertNodes,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { removeAndCheck } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import type { LexicalEditor, ParagraphNode, LexicalNode } from 'lexical'
import type { MouseEvent } from 'react'

export default class Index<T extends LexicalNode = any> {
	editor = null as LexicalEditor
	node = null as T
	key = ''
	ref = null as HTMLElement

	selected = false

	setSelected = null as (v: boolean) => void
	clearSelection = null as () => void
	unregister = null as () => void

	constructor() {
		makeAutoObservable(
			this,
			{
				editor: false,
				node: false,
				key: false,
				ref: false,
				setSelected: false,
				clearSelection: false
			},
			{ autoBind: true }
		)
	}

	init(
		editor: Index['editor'],
		node: T,
		key: Index['key'],
		setSelected: Index['setSelected'],
		clearSelection: Index['clearSelection']
	) {
		this.editor = editor
		this.node = node
		this.key = key
		this.ref = this.editor.getElementByKey(this.key)

		this.setSelected = setSelected
		this.clearSelection = clearSelection

		this.register()
	}

	onSelection(_: void, active_editor: LexicalEditor) {
		this.editor = active_editor

		this.checkSelected()

		return false
	}

	onClick(e: MouseEvent<HTMLSpanElement>) {
		if (this.selected) return true

		if (e.target === this.ref || this.ref.contains(e.target as HTMLElement)) {
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

	onEnter() {
		if (!this.selected) return false

		const target = this.node.getTopLevelElement().insertAfter($createParagraphNode()) as ParagraphNode

		window.requestAnimationFrame(() => this.editor.update(() => target.selectStart()))

		return true
	}

	onDelete(e: KeyboardEvent | MouseEvent) {
		if ((e as MouseEvent).nativeEvent instanceof PointerEvent) {
			e.preventDefault()

			this.clearSelection()
			this.setSelected(true)

			this.editor.update(() => this.node.remove())

			return true
		}

		if (this.selected && $isNodeSelection($getSelection())) {
			e.preventDefault()

			removeAndCheck(this.node)

			return true
		}

		return false
	}

	checkSelected() {
		if (this.selected) return

		const selection = $getSelection()

		if (!selection) return

		const nodes = selection.getNodes()
		const node = nodes.at(0)

		if (nodes.length !== 1 || !node) return

		if (this.node.is(node)) {
			this.setSelected(true)
		}
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(SELECTION_CHANGE_COMMAND, this.onSelection, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand<MouseEvent>(CLICK_COMMAND, this.onClick, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_ENTER_COMMAND, this.onEnter, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_DELETE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_BACKSPACE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW)
		)
	}

	off() {
		this.unregister()
	}
}
