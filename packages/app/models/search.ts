import { makeAutoObservable } from 'mobx'

import { getDocItem } from '@/utils'

import type { App, DirTree } from '@/types'

export default class Index {
	open = false
	module = '' as App.ModuleType
	items = [] as Array<{ item: any; file: DirTree.Item; setting: any }>
	index = 0
	search_history = [] as Array<string>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		this.on()
	}

	async searchByInput(text: string) {
		if (!text) return (this.items = [])

		if (this.module === 'todo') {
			const docs = await $db.todo_items
				.find({
					selector: {
						text: { $regex: `.*${text}.*`, $options: 'i' },
						type: 'todo'
					},
					index: 'file_id'
				})
				.exec()

			const file_ids = docs.map(item => item.file_id)

			const files = await $db.dirtree_items.findByIds(file_ids).exec()
			const settings = await $db.module_setting.findByIds(file_ids).exec()

			this.items = file_ids.map((_, index) => ({
				item: getDocItem(docs[index]),
				file: getDocItem(files.get(docs[index].file_id)),
				setting: JSON.parse(getDocItem(settings.get(docs[index].file_id)).setting)
			}))
		}

		if (this.items.length) {
			this.addSearchHistory(text)
		}
	}

	addSearchHistory(text: string) {
		if (this.search_history.includes(text)) return

		this.search_history.unshift(text)

		if (this.search_history.length > 15) {
			this.search_history.pop()
		}

		this.search_history = $copy(this.search_history)
	}

	showSearch() {
		if (this.module === 'setting' || !this.module) return

		this.open = true
	}

	closeSearch() {
		this.open = false
		this.items = []
		this.index = 0
	}

	on() {
		$app.Event.on('global.app.showSearch', this.showSearch)
		$app.Event.on('global.app.closeSearch', this.closeSearch)
	}

	off() {
		$app.Event.off('global.app.showSearch', this.showSearch)
		$app.Event.off('global.app.closeSearch', this.closeSearch)
	}
}
