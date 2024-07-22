import { makeAutoObservable } from 'mobx'

import { module_map } from '@/appdata'
import { SHOW_MODAL_COMMAND } from '@/Editor/commands'
import { getDocItem, sleep } from '@/utils'

import type { MouseEvent } from 'react'
import type { LexicalEditor } from 'lexical'
import type { IPropsRef } from '../types'
import type { Subscription } from 'rxjs'
import type { RxQuery } from 'rxdb'

import type { App, DirTree } from '@/types'

export default class Index {
	editor = null as LexicalEditor
	key = ''
	module = '' as IPropsRef['module']
	id = '' as IPropsRef['id']
	watcher = null as Subscription

	item = null as any

	constructor() {
		makeAutoObservable(
			this,
			{ editor: false, key: false, module: false, id: false, watcher: false },
			{ autoBind: true }
		)
	}

	init(editor: Index['editor'], key: Index['key'], module: Index['module'], id: Index['id']) {
		this.editor = editor
		this.key = key
		this.module = module
		this.id = id

		this.on()
	}

	async onEdit(e: MouseEvent<HTMLSpanElement>) {
		e.stopPropagation()

		if (e.metaKey || e.ctrlKey) {
			this.editor.dispatchCommand(SHOW_MODAL_COMMAND, { type: 'Ref', node_key: this.key })
		} else {
			let module: App.ModuleType
			let file_id: string
			let file: DirTree.Item

			if (this.module === 'file') {
				module = this.item.module
				file_id = this.id
				file = this.item
			} else {
				module = this.module
				file_id = this.item.file_id

				const file_doc = await $db.dirtree_items.findOne(file_id).exec()

				file = getDocItem(file_doc)
			}

			const find_view = await $app.Event.emit('global.stack.find', file_id)
			const view = $copy(find_view)

			if (view?.view) {
				await $app.Event.emit('global.stack.add', view.view)
			} else {
				await $app.Event.emit('global.stack.add', {
					id: file_id,
					module,
					file,
					active: true,
					fixed: true
				})
			}

			if (this.module !== 'file') {
				await sleep(360)
				await $app.Event.emit(`${module}/${file_id}/redirect`, this.id)
			}
		}
	}

	on() {
		let query: RxQuery

		if (this.module === 'file') {
			query = $db.dirtree_items.findOne(this.id)
		} else {
			query = $db.collections[module_map[this.module]].findOne(this.id)
		}

		this.watcher = query.$.subscribe(res => {
			this.item = res ? getDocItem(res) : null
		})
	}

	off() {
		this.watcher.unsubscribe()
	}
}
