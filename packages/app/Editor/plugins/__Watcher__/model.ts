import {
	$createNodeSelection,
	$getSelection,
	$isNodeSelection,
	$isRangeSelection,
	$setSelection,
	COMMAND_PRIORITY_CRITICAL,
	DELETE_CHARACTER_COMMAND,
	SELECTION_CHANGE_COMMAND
} from 'lexical'

import blocks from '@/Editor/blocks'
import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { mergeRegister } from '@lexical/utils'
import { deepEqual } from '@openages/stk/react'

import type { LexicalEditor, LexicalNode } from 'lexical'

export default class Index {
	editor = null as LexicalEditor
	path = []

	init(editor: Index['editor']) {
		this.editor = editor
	}

	watcher() {
		const selection = $getSelection()

		if (!$isNodeSelection(selection) && !$isRangeSelection(selection)) return

		let nodes: Array<LexicalNode>

		if ($isNodeSelection(selection)) {
			nodes = selection.getNodes()
		}

		if ($isRangeSelection(selection)) {
			const anchor = selection.anchor
			const focus = selection.focus

			if (anchor.offset !== focus.offset) return

			nodes = anchor.getNode().getParents()

			if (anchor.key !== focus.key) {
				const select_nodes = selection.getNodes().reverse()

				select_nodes.forEach(item => {
					if (nodes.findIndex(n => n.__key === item.__key) === -1) {
						nodes.unshift(item)
					}
				})
			}
		}

		const path = nodes.map(item => ({ type: item.getType(), key: item.getKey() }))

		if (deepEqual(path, this.path)) return

		this.editor.dispatchCommand(SELECTION_ELEMENTS_CHANGE, path)

		this.path = path

		return false
	}

	onDelete() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection)) return

		const nodes = selection.getNodes()

		if (nodes.length === 1) {
			const node = nodes[0]
			const key = node.getKey()

			if (!blocks.includes(node.getType())) return false

			this.editor.update(() => {
				const selection = $createNodeSelection()

				selection.add(key)

				$setSelection(selection)
			})

			return true
		}

		return false
	}

	register() {
		return mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				this.watcher.bind(this),
				COMMAND_PRIORITY_CRITICAL
			),
			this.editor.registerCommand(
				DELETE_CHARACTER_COMMAND,
				this.onDelete.bind(this),
				COMMAND_PRIORITY_CRITICAL
			)
		)
	}
}
