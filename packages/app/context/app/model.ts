import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { App, Auth, DB, Layout, Locale, Screenlock, Search, Setting, Shortcuts, Stack } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(
		public locale: Locale,
		public stack: Stack,
		public db: DB,
		public screenlock: Screenlock,
		public auth: Auth,
		public layout: Layout,
		public setting: Setting,
		public app: App,
		public shortcuts: Shortcuts,
		public search: Search
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		this.stack.init()

		await this.db.init()

		this.screenlock.init()
		this.app.init()
		this.shortcuts.init()
		this.search.init()

		this.on()
	}

	on() {
		$app.Event.on('global.stack.add', this.stack.add)
		$app.Event.on('global.stack.updateFile', this.stack.updateFile)
		$app.Event.on('global.stack.removeFile', this.stack.removeFile)
	}

	off() {
		this.db.off()
		this.locale.off()
		this.layout.off()
		this.setting.off()
		this.stack.off()
		this.app.off()
		this.shortcuts.off()
		this.search.off()

		$app.Event.off('global.stack.add', this.stack.add)
		$app.Event.off('global.stack.updateFile', this.stack.updateFile)
		$app.Event.off('global.stack.removeFile', this.stack.removeFile)
	}
}
