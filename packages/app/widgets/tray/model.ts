import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { KVSettingsModel, Utils } from '@/models'
import { conf, ipc, is_electron } from '@/utils'
import { setStorageWhenChange } from '@openages/stk/mobx'

import type { Tray } from '@/types'
import type { App } from '@electron/types'

@injectable()
export default class Index {
	view = 'schedule' as 'todo' | 'schedule'

	get todo_active() {
		return this.settings?.settings?.todo?.active
	}

	get schedule_active() {
		return this.settings?.settings?.schedule?.active
	}

	get todo_file_id() {
		return this.settings?.settings?.todo?.file_id
	}

	get todo_angle_id() {
		return this.settings?.settings?.todo?.angle_id
	}

	get schedule_file_id() {
		return this.settings?.settings?.schedule?.file_id
	}

	constructor(
		public utils: Utils,
		public settings: KVSettingsModel<Tray.Setting>
	) {
		makeAutoObservable(this, { utils: false, settings: false }, { autoBind: true })
	}

	init() {
		this.utils.acts = [setStorageWhenChange([{ ['widgets_tray_view']: 'view' }], this)]

		this.settings.init('tray_settings')
	}

	async exitApp() {
		if (!is_electron) return

		await ipc.app.exit.query()
	}

	async toWidget() {
		if (!is_electron) return

		const tray_bounds = (await conf.get('tray_bounds')) as App.Widget

		if (!tray_bounds) {
			await conf.set('tray_bounds', { show: true })

			return
		}

		await conf.set('tray_bounds', { ...tray_bounds, show: !tray_bounds.show })
	}

	off() {
		this.utils.off()
		this.settings.off()
	}
}
