import {
	$copyNode,
	$getNearestNodeFromDOMNode,
	$isDecoratorNode,
	$isParagraphNode,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DRAGOVER_COMMAND,
	DROP_COMMAND
} from 'lexical'
import { throttle } from 'lodash-es'
import { makeAutoObservable, runInAction } from 'mobx'
import ntry from 'nice-try'
import { injectable } from 'tsyringe'

import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { $getMatchingParent } from '@/Editor/utils'
import Utils from '@/models/utils'
import { $isListItemNode, $isListNode } from '@lexical/list'
import { eventFiles } from '@lexical/rich-text'
import { $getNearestBlockElementAncestorOrThrow, isHTMLElement } from '@lexical/utils'

import { $isCodeNode } from '../Code/utils'
import { $isImageNode } from '../Image/utils'
import { $isQuoteNode } from '../Quote/utils'
import { $isTableCellNode, $isTableNode } from '../Table/utils'
import { $isToggleBtnNode, $isToggleHeadNode, $isToggleNode } from '../Toggle/utils'

import type { LexicalEditor, LexicalNode } from 'lexical'
import type { DragEvent as ReactDragEvent } from 'react'
import type { ListNode } from '@lexical/list'

@injectable()
export default class Index {
	id = ''
	container = null as HTMLDivElement
	editor = null as LexicalEditor
	active_node = null as LexicalNode
	over_node = null as LexicalNode

	position_handler = { left: 0, top: 0 }
	style_line = { width: 0, left: 0, top: 0 }
	visible_handler = false
	visible_line = false
	dragging = false

	constructor(public utils: Utils) {
		makeAutoObservable(
			this,
			{
				utils: false,
				id: false,
				container: false,
				editor: false,
				active_node: false,
				over_node: false,
				onMouseMove: false,
				onDragOver: false,
				onDrop: false
			},
			{ autoBind: true }
		)

		this.onMouseMove = throttle(this.onMouseMove.bind(this), 180)
	}

	init(id: Index['id'], editor: Index['editor']) {
		this.id = id
		this.container = document.querySelector(`#${id} .__editor_container`)
		this.editor = editor

		this.on()
	}

	reset() {
		this.active_node = null
		this.over_node = null
		this.position_handler = { left: 0, top: 0 }
		this.style_line = { width: 0, left: 0, top: 0 }
		this.visible_handler = false
		this.visible_line = false
		this.dragging = false

		return false
	}

	onMouseMove(e: MouseEvent) {
		const target = e.target

		if (this.dragging) return
		if (!isHTMLElement(target)) return
		if (!target.closest('.__editor_root')) return
		if (target.closest('.__editor_draggable_handler')) return

		this.editor.update(() => {
			const active_node = this.getNode(e)

			if (!active_node) return
			if (this.active_node && this.active_node.is(active_node)) return

			this.active_node = active_node

			runInAction(() => {
				this.position_handler = this.getNodePosition(this.active_node)
				this.visible_handler = true
			})
		})
	}

	onDragStart(e: ReactDragEvent<HTMLDivElement>) {
		if (!e.dataTransfer || !this.active_node) return

		this.dragging = true

		const key = this.active_node.getKey()
		const el = this.editor.getElementByKey(key)

		if ($isTableNode(this.active_node)) el.style.transform = 'translateZ(0)'

		e.dataTransfer.setDragImage(el, 0, 0)
	}

	onDragEnd(e: ReactDragEvent<HTMLDivElement>) {
		e.preventDefault()

		if (!this.active_node) return

		this.reset()
	}

	onDragOver(e: DragEvent) {
		e.preventDefault()

		if (!this.active_node) return

		const target = e.target
		const [is_file] = eventFiles(e)

		if (is_file) return
		if (!isHTMLElement(target)) return
		if (!target.closest('.__editor_root')) return

		this.editor.update(() => {
			const over_node = this.getNode(e)

			if (!over_node) return
			if (this.active_node && this.active_node.is(over_node)) return

			this.over_node = over_node

			runInAction(() => {
				this.style_line = this.getNodePosition(this.over_node, true) as Index['style_line']
				this.visible_line = true
			})
		})

		return true
	}

	onDrop() {
		if (!this.active_node || !this.over_node) return

		if ($isListItemNode(this.active_node)) {
			const active_list_node = $getMatchingParent(this.active_node, $isListNode) as ListNode
			const over_list_node = $getMatchingParent(this.over_node, $isListNode)

			if (!over_list_node) {
				const target_list_node = $copyNode(active_list_node)

				target_list_node.append(this.active_node)

				this.over_node.insertAfter(target_list_node)

				return
			}
		}

		this.over_node.insertAfter(this.active_node)

		this.reset()

		return true
	}

	getNode(e: MouseEvent | DragEvent) {
		const target = e.target as HTMLElement
		const node = $getNearestNodeFromDOMNode(target)

		if (!node) return
		if ($isToggleBtnNode(node)) return
		if (!node.getTextContent() && $isParagraphNode(node)) return
		if ($isListNode(node)) return
		if ($isDecoratorNode(node)) return node

		const target_node = ntry(() => $getNearestBlockElementAncestorOrThrow(node))

		if (target_node) {
			const head_node = $getMatchingParent(target_node, $isToggleHeadNode)

			if (head_node) return $getMatchingParent(target_node, $isToggleNode)

			const table_node = $getMatchingParent(target_node, $isTableNode)
			const table_cell_node = $getMatchingParent(target_node, $isTableCellNode)

			if (table_node && table_cell_node && !table_cell_node.getTextContent().length) {
				return table_node
			}

			if ($isTableCellNode(target_node)) return null
		}

		return target_node
	}

	getNodePosition(node: LexicalNode, line?: boolean) {
		const el_node = this.editor.getElementByKey(node.getKey())
		const rect_container = this.container.getBoundingClientRect()
		const rect_node = el_node.getBoundingClientRect()

		if (line) {
			return {
				width: rect_node.width,
				left: rect_node.left - rect_container.left,
				top: rect_node.top - rect_container.top + rect_node.height - 2
			}
		} else {
			let margin_left = 0
			let margin_top = 6

			if (
				$isListItemNode(node) &&
				($getMatchingParent(node, $isListNode) as ListNode).getListType() !== 'check'
			) {
				margin_left = 18
			}

			if (
				$isTableNode(node) ||
				$isImageNode(node) ||
				$isQuoteNode(node) ||
				$isCodeNode(node) ||
				$isToggleNode(node)
			) {
				margin_top = 1
			}

			return {
				left: rect_node.left - rect_container.left - 19.2 - margin_left,
				top: rect_node.top - rect_container.top + margin_top
			}
		}
	}

	checkSelection() {
		if (!this.active_node) return

		const el = this.editor.getElementByKey(this.active_node.getKey())

		if (el) return

		this.reset()
	}

	on() {
		const container = document.getElementById(this.id)

		container.addEventListener('mousemove', this.onMouseMove)
		container.addEventListener('mouseleave', this.reset)

		this.utils.acts = [
			this.editor.registerCommand(DRAGOVER_COMMAND, this.onDragOver.bind(this), COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(DROP_COMMAND, this.onDrop.bind(this), COMMAND_PRIORITY_HIGH),
			this.editor.registerCommand(
				SELECTION_ELEMENTS_CHANGE,
				this.checkSelection.bind(this),
				COMMAND_PRIORITY_LOW
			)
		]
	}

	off() {
		const container = document.getElementById(this.id)

		container.removeEventListener('mousemove', this.onMouseMove)
		container.removeEventListener('mouseleave', this.reset)

		this.utils.off()
	}
}
