import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { getDocItem, getDocItemsData } from '@/utils'

import type { LexicalEditor } from 'lexical'
import type { App, DirTree } from '@/types'

@injectable()
export default class Index {
	editor = null as LexicalEditor

	module = 'todo' as App.ModuleType
	latest_files = [] as Array<DirTree.Item>
	latest_items = [] as Array<{ item: any; file: DirTree.Item }>
	search_items: Array<unknown>

	constructor() {
		makeAutoObservable(this, { editor: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.getLatestItems()
	}

	onChangeModule(v: Index['module']) {
		this.module = v

		this.getLatestItems()
	}

	onItem(type: 'file' | App.ModuleType, index: number) {}

	getLatestItems() {
		switch (this.module) {
			case 'todo':
				this.getTodoLatestFiles()
				this.getTodoLatestItems()
				break
			case 'note':
				break
			case 'schedule':
				break
		}
	}

	async getTodoLatestFiles() {
		const doc_items = await $db.dirtree_items
			.find({ selector: { module: 'todo', type: 'file' } })
			.sort({ update_at: 'desc', create_at: 'desc' })
			.limit(12)
			.exec()

		this.latest_files = getDocItemsData(doc_items)
	}

	async getTodoLatestItems() {
		const docs = await $db.todo_items
			.find({ selector: { type: 'todo', archive: false }, index: 'file_id' })
			.sort({ update_at: 'desc', create_at: 'desc' })
			.limit(12)
			.exec()

		const file_ids = docs.map(item => item.file_id)

		const files = await $db.dirtree_items.findByIds(file_ids).exec()

		this.latest_items = file_ids.map((_, index) => ({
			item: getDocItem(docs[index]),
			file: getDocItem(files.get(docs[index].file_id))
		}))
	}
}
