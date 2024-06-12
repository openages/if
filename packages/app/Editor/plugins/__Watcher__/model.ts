import {
	$createNodeSelection,
	$createParagraphNode,
	$getRoot,
	$getSelection,
	$isRangeSelection,
	$setSelection,
	COMMAND_PRIORITY_CRITICAL,
	DELETE_CHARACTER_COMMAND,
	RootNode,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { injectable } from 'tsyringe'

import blocks from '@/Editor/blocks'
import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import Utils from '@/models/utils'
import { mergeRegister } from '@lexical/utils'
import { deepEqual } from '@openages/stk/react'

import type { LexicalEditor, LexicalNode, BaseSelection } from 'lexical'

@injectable()
export default class Index {
	editor = null as LexicalEditor
	path = []
	selection = null as BaseSelection

	unregister = null as () => void

	constructor(public utils: Utils) {}

	init(editor: Index['editor']) {
		this.editor = editor

		this.on()
	}

	watcher() {
		const selection = $getSelection()

		if (!selection) return

		let nodes: Array<LexicalNode> = selection.getNodes()

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

		if (deepEqual(path, this.path) && selection.is(this.selection)) return

		this.editor.dispatchCommand(SELECTION_ELEMENTS_CHANGE, path)

		this.path = path
		this.selection = selection

		const root = $getRoot()

		if (root.getChildren().length > 1) {
			this.removeEventListners()
		} else {
			this.addEventListners()
		}

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

	onRootTranform(node: RootNode) {
		if (!node.getChildren().length) {
			node.append($createParagraphNode())
		}
	}

	addEventListners() {
		this.removeEventListners()

		this.utils.acts = [this.editor.registerNodeTransform(RootNode, this.onRootTranform.bind(this))]
	}

	removeEventListners() {
		this.utils.acts.forEach(item => item())

		this.utils.acts = []
	}

	on() {
		this.unregister = mergeRegister(
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

	off() {
		this.removeEventListners()

		this.unregister()
	}
}
