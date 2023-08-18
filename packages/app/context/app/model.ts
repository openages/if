import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { LocaleModel, SettingModel, LayoutModel, UserModel, DB, Tabs } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(
		public locale: LocaleModel,
		public setting: SettingModel,
		public layout: LayoutModel,
		public user: UserModel,
		public db: DB,
		public tabs: Tabs
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
            this.db.init()
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
	}
}
