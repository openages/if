import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { App, Auth, DB, Layout, Locale, Screenlock, Search, Setting, Shortcuts, Stack, Timer } from '@/models'

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
		public search: Search,
		public timer: Timer
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(unlock?: boolean) {
		this.on()
		this.stack.init()

		await this.db.init()
		await this.screenlock.init(unlock)

		if (this.screenlock.screenlock_open) return this.lock()

		this.app.init()
		this.shortcuts.init()
		this.search.init()
		this.timer.init()
	}

	lock() {
		this.stack.off()
	}

	unlock() {
		this.off()
		this.init(true)
	}

	on() {
		$app.Event.on('global.app.lock', this.lock)
		$app.Event.on('global.app.unlock', this.unlock)
	}

	off() {
		this.db.off()
		this.locale.off()
		this.layout.off()
		this.setting.off()
		this.stack.off()
		this.screenlock.off()
		this.app.off()
		this.shortcuts.off()
		this.search.off()
		this.timer.off()

		$app.Event.off('global.app.lock', this.lock)
		$app.Event.off('global.app.unlock', this.unlock)
	}
}
