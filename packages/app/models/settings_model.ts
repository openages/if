import { makeAutoObservable } from 'mobx'

import type { Subscription } from 'rxjs'
import type { DocKV } from '@/schemas'

export default class Index<T> {
	doc = null as unknown as DocKV
	settings = {} as T
	settings_watcher = {} as Subscription

	constructor() {
		makeAutoObservable(this, { doc: false, settings_watcher: false }, { autoBind: true })
	}

	init(key: string) {
		this.on(key)
	}

	on(key: string) {
		this.settings_watcher = $db.kv.findOne(key).$.subscribe(doc => {
			this.settings = JSON.parse(doc!.value)
		})
	}

	off() {
		this.settings_watcher?.unsubscribe?.()
	}
}
