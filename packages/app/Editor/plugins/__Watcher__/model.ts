import {
	$createNodeSelection,
	$createParagraphNode,
	$getRoot,
	$getSelection,
	$isNodeSelection,
	$isRangeSelection,
	$setSelection,
	COMMAND_PRIORITY_CRITICAL,
	DELETE_CHARACTER_COMMAND,
	RootNode,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { debounce } from 'lodash-es'
import { injectable } from 'tsyringe'

import blocks from '@/Editor/blocks'
import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import transformers from '@/Editor/transformers'
import { $convertFromMarkdownString, $convertToMarkdownString, $getSelectionType } from '@/Editor/utils'
import Utils from '@/models/utils'
import { getDocItemsData } from '@/utils'
import { mergeRegister } from '@lexical/utils'
import { deepEqual } from '@openages/stk/react'

import type { LexicalEditor, LexicalNode, BaseSelection, ElementNode } from 'lexical'
import type { UpdateListenerArgs } from './types'
import type { Subscription } from 'rxjs'

@injectable()
export default class Index {
	id = ''
	editor = null as LexicalEditor
	path = []
	selection = null as BaseSelection
	watcher = null as Subscription

	unregister = null as () => void

	constructor(public utils: Utils) {}

	init(id: Index['id'], editor: Index['editor']) {
		this.id = id
		this.editor = editor

		this.on()
	}

	watch() {
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

		if ($isNodeSelection(selection)) {
			const node = selection.getNodes()[0]

			if (!node) return

			nodes = [node, ...node.getParents()]
		}

		const path = nodes.map(item => ({ type: item.getType(), key: item.getKey() }))

		const prev_selection_type = $getSelectionType(this.selection)
		const current_selection_type = $getSelectionType(selection)

		if (deepEqual(path, this.path) && prev_selection_type === current_selection_type) return

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

	onUpdate(args: UpdateListenerArgs) {
		const { dirtyElements, editorState, prevEditorState, dirtyLeaves } = args
		// const root = $getRoot()

		const change_nodes = Array.from(dirtyElements)
			.filter(item => item[0] !== 'root')
			.map(item => item[0])

		const curr_map = editorState._nodeMap
		const prev_map = prevEditorState._nodeMap

		console.log('------------')
		// console.dir(root.getChildren().map(item => [item.__key, item.getTextContent()]))
		console.log(dirtyElements, change_nodes, dirtyLeaves)
		console.log('current_map: ', curr_map)
		console.log('prev_map: ', prev_map)
		console.log('------------')

		console.log(editorState.toJSON())

		// change_nodes.forEach(async key => {
		// 	const id = `${this.id}|${key}`
		// 	const curr_node = curr_map.get(key)
		// 	const prev_node = prev_map.get(key)

		// 	const item = await $db.note_items.findOne(id).exec()

		// 	editorState.read(() => {
		// 		console.log($getRoot().getChildren())
		// 	})

		// 	// 新增
		// 	if (!item && curr_node && prev_node) {
		// 		const text = editorState.read(() =>
		// 			$convertToMarkdownString(transformers, curr_node as ElementNode, false)
		// 		)
		// 		console.log(curr_node, text)

		// 		// $db.note_items.insert({
		// 		//       id,
		// 		//       file_id:this.id,
		// 		//       key,
		// 		//       content:curr_node
		// 		// })
		// 	}
		// 	// 移除
		// 	// 更新
		// 	// 移动
		// })
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
		const onUpdate = debounce(this.onUpdate.bind(this), 1200)

		this.unregister = mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				this.watch.bind(this),
				COMMAND_PRIORITY_CRITICAL
			),
			this.editor.registerCommand(
				DELETE_CHARACTER_COMMAND,
				this.onDelete.bind(this),
				COMMAND_PRIORITY_CRITICAL
			),
			this.editor.registerUpdateListener(onUpdate)
		)

		this.watcher = $db.note_items.find({ selector: { file_id: this.id } }).$.subscribe(docs => {
			const items = getDocItemsData(docs)

			this.editor.update(() => {
				const root = $getRoot()
			})
			// console.log(items)
		})
	}

	off() {
		this.removeEventListners()

		this.unregister()

		if (this.watcher) this.watcher.unsubscribe()
	}
}
