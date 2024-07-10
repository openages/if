import { $getNodeByKey, $getRoot } from 'lexical'
import { debounce, uniq } from 'lodash-es'
import { injectable } from 'tsyringe'

import { $exportNodeToJson, $restoreNodeFromJson } from '@/Editor/utils'
import { getDocItem, getDocItemsData, sortLinkNodes } from '@/utils'
import { deepEqual } from '@openages/stk/react'

import type { LexicalEditor } from 'lexical'
import type { UpdateListenerArgs } from './types'
import type { Subscription } from 'rxjs'
import type { IPropsDataLoader } from './types'
import type { Note } from '@/types'

@injectable()
export default class Index {
	collection: IPropsDataLoader['collection']
	id = ''
	editor = null as LexicalEditor
	total_watcher = null as Subscription
	update_watcher = null as Subscription
	ids_array = null as Array<string>
	ids_map = null as Map<string, undefined>
	disable_watcher = false
      change_nodes=[] as Array<string>

	unregister = null as () => void

	constructor() {}

	init(collection: Index['collection'], id: Index['id'], editor: Index['editor']) {
		this.collection = collection
		this.id = id
		this.editor = editor

		this.on()
	}

	onUpdate(args: UpdateListenerArgs) {
		const { dirtyElements, editorState, prevEditorState, dirtyLeaves } = args
		const dirty_els = $copy(dirtyElements)
		const curr_map = editorState._nodeMap
		const prev_map = prevEditorState._nodeMap

		dirty_els.delete('root')

		const change_nodes = uniq(
			Array.from(dirty_els.keys())
				.concat(Array.from(dirtyLeaves))
				.map(item =>
					editorState.read(() => {
						const node = $getNodeByKey(item)

						if (node && node.__parent !== 'root') return node.getTopLevelElement().getKey()

						return item
					})
				)
		)

		console.log('------------')
		console.log(this.editor._nodes)
		// console.dir(root.getChildren().map(item => [item.__key, item.getTextContent()]))
		// console.log(change_nodes)
		// console.log('current_map: ', curr_map)
		// console.log('prev_map: ', prev_map)
		console.log('------------')

            return

		if (!change_nodes.length||deepEqual(this.change_nodes,change_nodes)) return

		change_nodes.forEach(async key => {
			const id = `${this.id}|${key}`
			const curr_node = curr_map.get(key)
			const prev_node = prev_map.get(key)

			const item = await $db.note_items.findOne(id).exec()

			// 新增
			if (!item && curr_node) {
				this.editor.update(() => {
					// console.log(editorState.toJSON())
					console.log($exportNodeToJson(curr_node))
				})
				// $db.note_items.insert({
				//       id,
				//       file_id:this.id,
				//       key,
				//       content:curr_node
				// })
			}
			// 移除
			// 更新
			// 移动
		})
	}

	addListner() {
		this.update_watcher = $db.collections[this.collection].findByIds(this.ids_array).$.subscribe(doc_map => {
			if (this.disable_watcher) return

			console.log(doc_map)
		})
	}

	removeListner() {
		this.update_watcher?.unsubscribe?.()
	}

	on() {
		const onUpdate = debounce(this.onUpdate.bind(this), 1200, { leading: true })

		this.unregister = this.editor.registerUpdateListener(onUpdate)

		return

		this.total_watcher = $db.collections[this.collection]
			.find({ selector: { file_id: this.id } })
			.$.subscribe(docs => {
				if (this.disable_watcher) return

				if (!this.ids_array.length) {
					docs.forEach(({ id }) => {
						this.ids_array.push(id)
						this.ids_map.set(id, undefined)
					})

					this.addListner()
				} else {
					const add_doc = [] as Array<Note.Item>
					const remove_ids_map = $copy(this.ids_map)
					const target_ids_array = [] as Index['ids_array']
					const target_ids_map = new Map<string, undefined>()

					docs.forEach(doc => {
						const { id } = doc

						if (this.ids_map.get(id)) {
							remove_ids_map.delete(id)
						} else {
							add_doc.push(getDocItem(doc))
						}

						target_ids_array.push(id)
						target_ids_map.set(id, undefined)
					})

					if (remove_ids_map.size > 0) {
						Array.from(remove_ids_map.keys()).forEach(key => {
							this.editor.update(() => {
								const node = $getNodeByKey(key)

								if (node) node.remove()
							})
						})
					}

					if (add_doc.length) {
						add_doc.forEach(item => {
							const { prev, next, content } = item
							const json = JSON.parse(content)

							this.editor.update(() => {
								const node = $restoreNodeFromJson(json, this.editor._nodes)

								if (prev) {
									const prev_node = $getNodeByKey(prev)

									prev_node.insertAfter(node)
								} else if (next) {
									const next_node = $getNodeByKey(next)

									next_node.insertBefore(node)
								} else {
									$getRoot().append(node)
								}
							})
						})
					}

					if (remove_ids_map.size > 0 || add_doc.length) {
						this.ids_array = target_ids_array
						this.ids_map = target_ids_map

						this.removeListner()
						this.addListner()
					}
				}
			})
	}

	off() {
		this.removeListner()

		this.unregister?.()
		this.total_watcher?.unsubscribe?.()
	}
}
