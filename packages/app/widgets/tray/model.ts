import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { KVSettingsModel, ModuleSettingsModel } from '@/models'

import type { Schedule, Tray } from '@/types'

@injectable()
export default class Index {
	view = 'schedule' as 'todo' | 'schedule'

	get todo_file_id() {
		return this.settings?.settings?.todo?.file_id
	}

	get todo_angle_id() {
		return this.settings?.settings?.todo?.angle_id
	}

	get schedule_file_id() {
		return this.settings?.settings?.schedule?.file_id
	}

	constructor(public settings: KVSettingsModel<Tray.Setting>) {
		makeAutoObservable(this, { settings: false }, { autoBind: true })
	}

	init() {
		this.settings.init('tray_settings')
	}

	exitApp() {}

	off() {
		this.settings.off()
	}
}
