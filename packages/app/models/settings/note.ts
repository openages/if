import { makeAutoObservable } from 'mobx'

import { DocKV } from '@/schemas'
import { Note } from '@/types'

import type { Subscription } from 'rxjs'

export default class Index {
	doc = null as DocKV
	settings = {} as Note.Setting
	settings_watcher = {} as Subscription

	constructor() {
		makeAutoObservable(this, { doc: false }, { autoBind: true })
	}

	init() {
		this.on()
	}

	on() {
		this.settings_watcher = $db.kv.findOne('note_settings').$.subscribe(doc => {
			this.settings = JSON.parse(doc.value)
		})
	}

	off() {
		this.settings_watcher?.unsubscribe?.()
	}
}
