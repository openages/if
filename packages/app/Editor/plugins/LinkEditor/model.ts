import {
	$getSelection,
	$isLineBreakNode,
	$isRangeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { getSelectedNode } from '@/Editor/utils'
import { $isAutoLinkNode, $isLinkNode } from '@lexical/link'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'

import type { LexicalEditor } from 'lexical'
import type { LinkNode } from '@lexical/link'
import type { FocusEvent } from 'react'

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

	check() {
		const selection = $getSelection()

		if ($isRangeSelection(selection)) {
			const selected_node = getSelectedNode(selection)
			const focus_link_node =
				$findMatchingParent(selected_node, $isLinkNode) ||
				$findMatchingParent(selected_node, $isAutoLinkNode)

			if (!focus_link_node) return this.reset()

			const bad_node = selection
				.getNodes()
				.filter(node => !$isLineBreakNode(node))
				.find(node => {
					const link_node =
						$findMatchingParent(node, $isLinkNode) || $findMatchingParent(node, $isAutoLinkNode)

					return (
						(focus_link_node && !focus_link_node.is(link_node)) ||
						(link_node && !link_node.is(focus_link_node))
					)
				})

			if (focus_link_node) {
				this.node = focus_link_node

				this.dom = this.editor.getElementByKey(focus_link_node.__key) as HTMLAnchorElement
				this.link = focus_link_node.getURL()
			} else {
				this.link = ''
			}

			if (!bad_node && this.link) return true
		}

		return this.reset()
	}

	show() {
		if (!this.link) return

		const selection = $getSelection()
		const root = this.editor.getRootElement()
		const native_selection = window.getSelection()
		const active_element = document.activeElement

		const is_range_selection = $isRangeSelection(selection)
		const is_contain = root?.contains(native_selection?.anchorNode)
		const is_editable = this.editor.isEditable()

		if (!is_range_selection || !native_selection || !active_element || !root || !is_contain || !is_editable) {
			return this.reset()
		}

		const rect = native_selection.focusNode?.parentElement?.getBoundingClientRect()

		if (rect) {
			this.visible = true
			this.position = { x: rect.x, y: rect.y + rect.height }
		}
	}

	onChange(e: FocusEvent<HTMLInputElement>) {
		e.preventDefault()

		if (!this.node) return

		this.editor.update(() => {
			const target = this.node.getWritable()

			if (e.target.value === target.__url) return

			target.__url = e.target.value
		})
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, active_editor) => {
					this.check()

					this.editor = active_editor

					return false
				},
				COMMAND_PRIORITY_CRITICAL
			),
			this.editor.registerCommand(
				CLICK_COMMAND,
				payload => {
					const selection = $getSelection()

					if ($isRangeSelection(selection)) {
						const node = getSelectedNode(selection)
						const link_node = $findMatchingParent(node, $isLinkNode)

						if (!$isLinkNode(link_node)) return false

						if (!this.editor.isEditable() || payload.metaKey || payload.ctrlKey) {
							window.open(link_node.getURL(), '_blank')

							return true
						} else {
							this.show()

							return true
						}
					}

					return false
				},
				COMMAND_PRIORITY_LOW
			)
		)
	}

	off() {
		this.unregister()
	}
}
