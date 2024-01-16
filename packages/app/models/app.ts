import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'
import Utils from '@/models/utils'
import { getDocItem } from '@/utils'
import { setStorageWhenChange, useInstanceWatch } from '@openages/stk/mobx'

import type { App, DirTree } from '@/types'
import type { Watch } from '@openages/stk/mobx'

@injectable()
export default class Index {
	app_modules = modules as App.Modules
	actives = [] as Array<{ app: App.ModuleType; pathname: string; key: string }>
	visible_app_menu = false
	visible_app_switch = false
	switch_index = 0

	search = {
		open: false,
		module: '' as App.ModuleType,
		items: [] as Array<{ item: any; file: DirTree.Item; setting: any }>,
		index: 0
	}

	get visibles() {
		return [this.visible_app_menu, this.visible_app_switch]
	}

	watch = {
		'visible_app_menu|visible_app_switch': () => {
			if (this.visible_app_menu) this.visible_app_switch = false
			if (this.visible_app_switch) this.visible_app_menu = false
		}
	} as Watch<Index & { 'visible_app_menu|visible_app_switch': any }>

	constructor(public utils: Utils) {
		makeAutoObservable(this, { watch: false }, { autoBind: true })

		this.utils.acts = [setStorageWhenChange(['app_modules'], this)]
	}

	get apps() {
		return $copy(this.app_modules).filter(item => {
			if (item.fixed) return true
			if (this.actives.find(i => i.app === item.title)) return true

			return false
		})
	}

	init() {
		this.utils.acts = [...useInstanceWatch(this)]

		this.on()
	}

	update(v: App.Modules) {
		this.app_modules = v
	}

	setActives(v: Index['actives']) {
		this.actives = v
	}

	toggleAppMenu() {
		this.visible_app_menu = !this.visible_app_menu
	}

	appSwitch() {
		if (!this.actives.length) return

		if (!this.visible_app_switch) {
			this.visible_app_switch = true
		} else {
			this.changeSwitchIndex()
		}
	}

	handleAppSwitch() {
		if (!this.visible_app_switch) return

		this.visible_app_switch = false

		$navigate(this.actives[this.switch_index].pathname)
	}

	changeSwitchIndex(index?: number) {
		if (index !== undefined) return (this.switch_index = index)

		const next_value = this.switch_index + 1

		if (next_value > this.actives.length - 1) {
			this.switch_index = 0
		} else {
			this.switch_index = next_value
		}
	}

	showSearch() {
		this.search.open = true
	}

	closeSearch() {
		this.search = { open: false, module: this.search.module, items: [], index: 0 }
	}

	async searchByInput(text: string) {
		if (!text) return (this.search.items = [])

		if (this.search.module === 'todo') {
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

			this.search.items = file_ids.map((_, index) => ({
				item: getDocItem(docs[index]),
				file: getDocItem(files.get(docs[index].file_id)),
				setting: JSON.parse(getDocItem(settings.get(docs[index].file_id)).setting)
			}))
		}
	}

	on() {
		$app.Event.on('global.app.toggleAppMenu', this.toggleAppMenu)
		$app.Event.on('global.app.appSwitch', this.appSwitch)
		$app.Event.on('global.app.handleAppSwitch', this.handleAppSwitch)
		$app.Event.on('global.app.showSearch', this.showSearch)
		$app.Event.on('global.app.closeSearch', this.closeSearch)

		window.addEventListener('blur', this.handleAppSwitch)
	}

	off() {
		this.utils.off()

		$app.Event.off('global.app.toggleAppMenu', this.toggleAppMenu)
		$app.Event.off('global.app.appSwitch', this.appSwitch)
		$app.Event.off('global.app.handleAppSwitch', this.handleAppSwitch)
		$app.Event.off('global.app.showSearch', this.showSearch)
		$app.Event.off('global.app.closeSearch', this.closeSearch)

		window.removeEventListener('blur', this.handleAppSwitch)
	}
}
