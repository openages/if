import { makeAutoObservable } from 'mobx'

import type { Subscription } from 'rxjs'
import type { Pomo } from '@/types'
import type { DocKV } from '@/schemas'

export default class Index {
	doc = null as unknown as DocKV
	settings = {} as Pomo.Setting
	settings_watcher = {} as Subscription

	constructor() {
		makeAutoObservable(this, { doc: false, settings_watcher: false }, { autoBind: true })
	}

	init() {
		this.on()
	}

	on() {
		this.settings_watcher = $db.kv.findOne('pomo_settings').$.subscribe(doc => {
			this.settings = JSON.parse(doc!.value)
		})
	}

	off() {
		this.settings_watcher?.unsubscribe?.()
	}
}
