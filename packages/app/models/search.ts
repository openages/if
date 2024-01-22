import { makeAutoObservable } from 'mobx'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { getDocItem } from '@/utils'
import { setStorageWhenChange } from '@openages/stk/mobx'

import type { App, DirTree } from '@/types'

@injectable()
export default class Index {
	open = false
	module = '' as App.ModuleType
	items = [] as Array<{ item: any; file: DirTree.Item; setting: any }>
	index = 0
	search_history = {} as Record<App.ModuleType, Array<string>>

	get history() {
		return this.module ? this.search_history[this.module] || [] : []
	}

	set history(v: Array<string>) {
		this.search_history[this.module] = v
	}

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })

		this.utils.acts = [setStorageWhenChange(['search_history'], this)]
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
		const history = this.search_history[this.module] || []

		if (history.includes(text)) return

		history.unshift(text)

		if (history.length > 15) {
			history.pop()
		}

		this.search_history[this.module] = history

		this.sync()
	}

	changeSearchIndex(index: number) {
		if (index < 0 || index > this.items.length - 1) return

		this.index = index

		const id = this.items[index]?.item?.id

		if (!id) return

		scrollIntoView(document.getElementById(`search_item_${id}`), {
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest'
		})
	}

	clearSearchHistory() {
		this.history = []

		this.sync()
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

	sync() {
		this.search_history = $copy(this.search_history)
	}

	on() {
		$app.Event.on('global.app.showSearch', this.showSearch)
		$app.Event.on('global.app.closeSearch', this.closeSearch)
	}

	off() {
		this.utils.off()

		$app.Event.off('global.app.showSearch', this.showSearch)
		$app.Event.off('global.app.closeSearch', this.closeSearch)
	}
}
