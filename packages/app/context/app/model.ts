import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { App, DB, Layout, Locale, Setting, Shortcuts, Stack } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(
		public db: DB,
		public locale: Locale,
		public layout: Layout,
		public setting: Setting,
		public stack: Stack,
		public app: App,
		public shortcuts: Shortcuts
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		this.stack.init()

		await this.db.init()

		this.app.init()
		this.shortcuts.init()

		this.on()
	}

	on() {
		$app.Event.on('global.stack.add', this.stack.add)
		$app.Event.on('global.stack.updateFile', this.stack.updateFile)
		$app.Event.on('global.stack.removeFile', this.stack.removeFile)
	}

	off() {
		this.db.instance?.destroy?.()
		this.locale.off()
		this.layout.off()
		this.setting.off()
		this.stack.off()
		this.app.off()
		this.shortcuts.off()

		$app.Event.off('global.stack.add', this.stack.add)
		$app.Event.off('global.stack.updateFile', this.stack.updateFile)
		$app.Event.off('global.stack.removeFile', this.stack.removeFile)
	}
}
