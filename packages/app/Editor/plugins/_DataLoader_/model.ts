import { $getNodeByKey, $getRoot } from 'lexical'
import { debounce, uniq } from 'lodash-es'
import { injectable } from 'tsyringe'

import { $exportNodeToJson, $restoreNodeFromJson } from '@/Editor/utils'
import { getDocItem, getDocItemsData, sortLinkNodes } from '@/utils'
import { disableWatcher } from '@/utils/decorators'
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
	ids_array = [] as Array<string>
	ids_map = new Map<string, undefined>()
	disable_watcher = false
	change_nodes = [] as Array<string>
	intial = true

	unregister = null as () => void

	constructor() {}

	init(collection: Index['collection'], id: Index['id'], editor: Index['editor']) {
		this.collection = collection
		this.id = id
		this.editor = editor

		this.on()
	}

	@disableWatcher
	async onUpdate(args: UpdateListenerArgs) {
		const { dirtyElements, editorState, prevEditorState, dirtyLeaves } = args
		const dirty_els = $copy(dirtyElements)
		const curr_map = editorState._nodeMap

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

		// console.log('------------')
		// console.log(change_nodes)
		// console.log('current_map: ', curr_map)
		// console.log('prev_map: ', prev_map)
		// console.log('------------')

		if (!change_nodes.length || deepEqual(this.change_nodes, change_nodes)) return

		const syncs = change_nodes.map(async key => {
			const curr_node = curr_map.get(key)
			const prev = curr_node.__prev
			const next = curr_node.__next
			const content = JSON.stringify(editorState.read(() => $exportNodeToJson(curr_node)))

			const item = await $db.note_items.findOne(key).exec()

			// 新增
			if (!item && curr_node) {
				if (!this.ids_array.includes(key)) {
					this.ids_array.push(key)
					this.ids_map.set(key, undefined)

					this.addUpdateListner()
				}

				return $db.note_items.insert({
					file_id: this.id,
					id: key,
					prev,
					next,
					content,
					create_at: new Date().valueOf()
				})
			}

			// 移除
			if (item && !curr_node) {
				console.log(2)
				return item.remove()
			}

			// 更新
			if (item && curr_node) {
				console.log(3)
				const euqal_prev = item.prev === prev
				const euqal_next = item.next === next
				const euqal_content = deepEqual(item.content, content)

				const target = {} as Partial<Note.Item>

				if (!euqal_prev) target['prev'] = prev
				if (!euqal_next) target['next'] = next
				if (!euqal_content) target['content'] = content

				return item.updateCRDT({ ifMatch: { $set: target } })
			}
		})

		await Promise.all(syncs)
	}

	addEditorListner() {
		const onUpdate = debounce(this.onUpdate.bind(this), 1200, { leading: true })

		this.unregister = this.editor.registerUpdateListener(onUpdate)
	}

	addMutationListner() {
		this.total_watcher = $db.collections[this.collection]
			.find({ selector: { file_id: this.id } })
			.$.subscribe(docs => {
				if (!this.ids_array.length || this.ids_array.length === 1) {
					docs.forEach(({ id }) => {
						this.ids_array.push(id)
						this.ids_map.set(id, undefined)
					})

					this.addUpdateListner()

					return
				}

				if (this.disable_watcher) return

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

					this.addUpdateListner()
				}
			})
	}

	addUpdateListner() {
		this.removeUpdateListner()

		this.update_watcher = $db.collections[this.collection].findByIds(this.ids_array).$.subscribe(doc_map => {
			// if (this.disable_watcher) return

			console.log('doc_map:', doc_map)
		})
	}

	removeUpdateListner() {
		this.update_watcher?.unsubscribe?.()
		this.update_watcher = null
	}

	on() {
		this.addMutationListner()
		this.addEditorListner()
		this.addUpdateListner()
	}

	off() {
		this.unregister?.()
		this.removeUpdateListner()

		this.total_watcher?.unsubscribe?.()
		this.total_watcher = null
	}
}
