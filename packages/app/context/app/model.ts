import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { DB, Locale, Layout, Setting, Tabs, App, Shortcuts } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(
		public db: DB,
		public locale: Locale,
		public layout: Layout,
		public setting: Setting,
		public tabs: Tabs,
		public app: App,
		public shortcuts: Shortcuts
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		this.app.on()

		await this.db.init()

            this.shortcuts.init()
		this.on()
	}

	on() {
		$app.Event.on('global.tabs.add', this.tabs.add)
		$app.Event.on('global.tabs.updateFile', this.tabs.updateFile)
		$app.Event.on('global.tabs.removeFile', this.tabs.removeFile)
	}

	off() {
		$app.Event.off('global.tabs.add', this.tabs.add)
		$app.Event.off('global.tabs.updateFile', this.tabs.updateFile)
		$app.Event.off('global.tabs.removeFile', this.tabs.removeFile)

		this.db.instance?.destroy?.()
		this.app.off()
		this.shortcuts.off()
	}
}
