import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { App, Auth, DB, Layout, Locale, Screenlock, Search, Setting, Shortcuts, Stack, Timer } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(
		public locale: Locale,
		public stack: Stack,
		public setting: Setting,
		public db: DB,
		public screenlock: Screenlock,
		public auth: Auth,
		public layout: Layout,
		public app: App,
		public shortcuts: Shortcuts,
		public search: Search,
		public timer: Timer
	) {
		makeAutoObservable(
			this,
			{
				locale: false,
				stack: false,
				setting: false,
				db: false,
				screenlock: false,
				auth: false,
				layout: false,
				app: false,
				shortcuts: false,
				search: false,
				timer: false
			},
			{ autoBind: true }
		)
	}

	async init(unlock?: boolean) {
		this.on()
		this.stack.init()
		this.setting.init()

		await this.db.init()
		await this.screenlock.init(unlock)

		if (this.screenlock.screenlock_open) return this.lock()

		this.auth.init()
		this.layout.init()
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
		this.locale.off()
		this.stack.off()
		this.setting.off()
		this.db.off()
		this.screenlock.off()
		this.auth.off()
		this.layout.off()
		this.app.off()
		this.shortcuts.off()
		this.search.off()
		this.timer.off()

		$app.Event.off('global.app.lock', this.lock)
		$app.Event.off('global.app.unlock', this.unlock)
	}
}
