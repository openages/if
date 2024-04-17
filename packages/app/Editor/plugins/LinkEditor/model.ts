import {
	$getSelection,
	$isLineBreakNode,
	$isRangeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	KEY_ESCAPE_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { getSelectedNode } from '@/Editor/utils'
import { $createLinkNode, $isAutoLinkNode, $isLinkNode } from '@lexical/link'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'

import type { LexicalEditor } from 'lexical'

export default class Index {
	editor = null as LexicalEditor
	visible = false
	link = ''
	rect = null as DOMRect

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { editor: false, unregister: false, init: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.register()
	}

	reset() {
		this.visible = false
		this.link = ''
		this.rect = null

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
				this.link = focus_link_node.getURL()
			} else if ($isLinkNode(selected_node)) {
				this.link = selected_node.getURL()
			} else {
				this.link = ''
			}

			if (!bad_node && this.link) return true
		}

		return this.reset()
	}

	show() {
		if (!this.check()) return

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
			const target_rect = native_selection.focusNode?.parentElement?.getBoundingClientRect()

			if (target_rect) {
				this.rect = target_rect
				this.visible = true
			}
		} else if (!active_element) {
			this.visible = false
			this.link = ''
		}
	}

	submit() {
		this.editor.update(() => {
			const selection = $getSelection()

			if ($isRangeSelection(selection)) {
				const parent = getSelectedNode(selection).getParent()

				if ($isAutoLinkNode(parent)) {
					const link_node = $createLinkNode(parent.getURL(), {
						target: parent.__target,
						title: parent.__title,
						rel: parent.__rel
					})

					parent.replace(link_node, true)
				}
			}
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
				KEY_ESCAPE_COMMAND,
				() => {
					if (this.visible) {
						this.visible = false

						return true
					}

					return false
				},
				COMMAND_PRIORITY_HIGH
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
