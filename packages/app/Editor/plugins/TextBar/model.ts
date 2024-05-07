import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_CRITICAL,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { getSelectedNode } from '@/Editor/utils'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isListNode } from '@lexical/list'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'

import type { LexicalEditor, LexicalNode, TextFormatType } from 'lexical'
import type { HeadingTagType } from '@lexical/rich-text'
import type { Formats, Format, ListType } from './types'

const text_formats = ['bold', 'italic', 'strikethrough', 'underline', 'code']

export default class Index {
	id = ''
	editor = null as LexicalEditor
	md = false
	ref = null as HTMLElement
	node = null as LexicalNode
	oveflow_x = 0

	visible = false
	position = null as { x: number; y: number }
	formats = {} as Formats
	heading_type = '' as HeadingTagType
	list_type = '' as ListType

	unregister = null as () => void

	constructor() {
		makeAutoObservable(
			this,
			{ editor: false, md: false, ref: false, node: false, oveflow_x: false, unregister: false },
			{ autoBind: true }
		)
	}

	init(id: Index['id'], editor: Index['editor'], md: Index['md']) {
		this.id = id
		this.editor = editor
		this.md = md

		this.register()
	}

	reset() {
		this.node = null
		this.oveflow_x = 0
		this.visible = false
		this.position = null
		this.formats = {} as Index['formats']
		this.heading_type = null
		this.list_type = null

		return false
	}

	updatePosition() {
		const native_selection = window.getSelection()
		const rect = native_selection.getRangeAt(0)?.getBoundingClientRect?.()

		if (rect) this.position = { x: rect.left, y: rect.y - 42 }
	}

	onMouseUp(e: MouseEvent) {
		if (this.ref === e.target || this.ref.contains(e.target as HTMLElement)) return

		this.editor.getEditorState().read(() => this.check())
	}

	onFormat(type: Format, v?: string) {
		if (text_formats.includes(type)) {
			this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, type as TextFormatType)
		} else {
			if (type === 'link') {
				if (this.formats['link']) {
					delete this.formats['link']

					this.editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
				} else {
					this.formats['link'] = true

					this.editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
				}
			}

			if (type === 'heading') {
			}

			if (type === 'list') {
			}
		}
	}

	check() {
		const selection = $getSelection()
		const root = this.editor.getRootElement()
		const native_selection = window.getSelection()
		const active_element = document.activeElement

		const is_range_selection = $isRangeSelection(selection)
		const is_contain = root?.contains(native_selection?.anchorNode)
		const is_editable = this.editor.isEditable()
		const is_collapsed = native_selection?.isCollapsed

		if (
			!is_range_selection ||
			!native_selection ||
			!active_element ||
			!root ||
			!is_contain ||
			!is_editable ||
			is_collapsed
		) {
			return this.reset()
		}

		this.formats = {} as Formats
		this.node = getSelectedNode(selection)

		if (selection.hasFormat('bold')) this.formats['bold'] = true
		if (selection.hasFormat('italic')) this.formats['italic'] = true
		if (selection.hasFormat('strikethrough')) this.formats['strikethrough'] = true
		if (selection.hasFormat('underline')) this.formats['underline'] = true
		if (selection.hasFormat('code')) this.formats['code'] = true

		if ($isLinkNode(this.node) || $isLinkNode(this.node.getParent())) {
			this.formats['link'] = true
		}

		const parent_heading_node = $findMatchingParent(this.node, $isHeadingNode)
		const parent_list_node = $findMatchingParent(this.node, $isListNode)

		if (parent_heading_node) {
			this.formats['heading'] = true
			this.heading_type = parent_heading_node.getTag()
		}

		if (parent_list_node) {
			this.formats['list'] = true
			this.list_type = parent_list_node.getListType() as ListType
		}

		const rect = native_selection.getRangeAt(0)?.getBoundingClientRect?.()

		if (rect) {
			this.visible = true
			this.position = { x: rect.left, y: rect.y - 42 }
		}
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.editor = active_editor

					this.check()

					return false
				},
				COMMAND_PRIORITY_CRITICAL
			),
			this.editor.registerUpdateListener(() => {
				this.editor.getEditorState().read(() => this.check())
			})
		)
	}

	off() {
		this.unregister()
	}
}
