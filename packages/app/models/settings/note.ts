import { makeAutoObservable } from 'mobx'

import { uploadFile } from '@/utils'
import importMdToNote from '@/utils/importMdToNote'

import type { Subscription } from 'rxjs'
import type { Note } from '@/types'
import type { DocKV } from '@/schemas'

export default class Index {
	doc = null as unknown as DocKV
	settings = {} as Note.Setting
	settings_watcher = {} as Subscription

	constructor() {
		makeAutoObservable(this, { doc: false, settings_watcher: false }, { autoBind: true })
	}

	init() {
		this.on()
	}

	async importMds() {
		const files = await uploadFile({ accept: '.md', max_count: 999 })

		if (!files || !files.length) return

		await importMdToNote(files)
	}

	on() {
		this.settings_watcher = $db.kv.findOne('note_settings').$.subscribe(doc => {
			this.settings = JSON.parse(doc!.value)
		})
	}

	off() {
		this.settings_watcher?.unsubscribe?.()
	}
}
