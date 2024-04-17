import {
	$createParagraphNode,
	$getSelection,
	$isNodeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { mergeRegister } from '@lexical/utils'

import { IPropsComponent } from '../types'

import type { LexicalEditor, ParagraphNode } from 'lexical'
import type { MouseEvent, FocusEvent, CSSProperties } from 'react'
import type ImageNode from './index'

export default class Index {
	key = ''
	editor = null as LexicalEditor
	ref = null as HTMLImageElement
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
	}

	onClick(e: MouseEvent<HTMLImageElement>) {
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
		e.preventDefault()

		this.editor.update(() => {
			const target = this.node.getWritable()

			if (e.target.value === target.__alt) return

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

	onEnter() {
		if (!this.selected) return false

		const target = this.node.insertAfter($createParagraphNode()) as ParagraphNode

		window.requestAnimationFrame(() => this.editor.update(() => target.selectStart()))

		return true
	}

	checkSelected() {
		if (this.selected) return

		const selection = $getSelection()

		if (!selection) return

		const nodes = selection.getNodes()
		const node = nodes.at(0) as ImageNode

		if (nodes.length !== 1 || !node) return

		if (this.node.is(node)) {
			this.setSelected(true)
		}
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.editor = active_editor

					this.checkSelected()

					return false
				},
				COMMAND_PRIORITY_LOW
			),
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
