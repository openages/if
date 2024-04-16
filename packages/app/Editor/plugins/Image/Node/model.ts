import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { mergeRegister } from '@lexical/utils'

import { IPropsComponent } from '../types'

import type { LexicalEditor, EditorState } from 'lexical'
import type { MouseEvent, FocusEvent, CSSProperties } from 'react'
import type ImageNode from './index'

export default class Index {
	key = ''
	editor = null as LexicalEditor
	ref = null as HTMLImageElement
	mounted = false
	node = null as IPropsComponent['node']

	selected = false

	setSelected = null as (v: boolean) => void
	clearSelection = null as () => void
	unregister = null as () => void

	constructor() {
		makeAutoObservable(
			this,
			{
				key: false,
				editor: false,
				ref: false,
				mounted: false,
				node: false,
				setSelected: false,
				clearSelection: false,
				unregister: false
			},
			{ autoBind: true }
		)
	}

	init(
		editor: Index['editor'],
		node: IPropsComponent['node'],
		key: Index['key'],
		setSelected: Index['setSelected'],
		clearSelection: Index['clearSelection']
	) {
		this.editor = editor
		this.node = node
		this.key = key
		this.setSelected = setSelected
		this.clearSelection = clearSelection

		this.register()

		this.mounted = true
	}

	getSelected(active_editor?: EditorState) {
		const editor = active_editor || this.editor.getEditorState()

		return editor.read(() => {
			const selection = $getSelection()

			if (!selection) return

			const node = selection.getNodes().at(0) as ImageNode

			if (!node) return

			return node.getKey() === this.key
		})
	}

	onClick(e: MouseEvent<HTMLImageElement>) {
		if (this.getSelected()) return true

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

	onDelete(e: KeyboardEvent | MouseEvent) {
		if ((e as MouseEvent).nativeEvent instanceof PointerEvent) {
			this.editor.update(() => this.node.remove())

			return
		}

		if (this.selected && $isNodeSelection($getSelection())) {
			e.preventDefault()

			this.node.remove()

			return true
		}

		return false
	}

	onChangeAlt(e: FocusEvent<HTMLInputElement>) {
		this.editor.update(() => {
			const target = this.node.getWritable()

			target.__alt = e.target.value
		})
	}

	onChangeAlign(v: CSSProperties['justifyContent']) {
		this.editor.update(() => {
			const target = this.node.getWritable()

			target.__align = v
		})
	}

	onChangeObjectFit(v: CSSProperties['objectFit']) {
		this.editor.update(() => {
			const target = this.node.getWritable()

			target.__object_fit = v
		})
	}

	onChangeSize(type: 'width' | 'height', v: string) {
		this.editor.update(() => {
			const target = this.node.getWritable()

			if (type === 'width') target.__width = v.indexOf('%') !== -1 ? v : Number(v)
			if (type === 'height') target.__height = v.indexOf('%') !== -1 ? v : Number(v)
		})
	}

	onReset() {
		this.editor.update(() => {
			const target = this.node.getWritable()

			target.__width = undefined
			target.__height = undefined
			target.__align = undefined
			target.__object_fit = undefined
		})
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerUpdateListener(({ editorState }) => {
				if (!this.mounted) return

				this.selected = this.getSelected(editorState)
			}),
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.editor = active_editor

					return false
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand<MouseEvent>(CLICK_COMMAND, this.onClick, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_DELETE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_BACKSPACE_COMMAND, this.onDelete, COMMAND_PRIORITY_LOW)
		)
	}

	off() {
		this.unregister()
	}
}
