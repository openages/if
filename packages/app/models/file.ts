import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import type { DirTree } from '@/types'
import type { Subscription } from 'rxjs'

@injectable()
export default class Index {
	id = ''
	data = {} as DirTree.Item
	data_watcher = {} as Subscription
	loading = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(id: string) {
		this.id = id

		this.watch()
		this.query()
	}

	getQuery() {
		return $db.dirtree_items.findOne(this.id)
	}

	async query() {
		this.loading = true

		const item = await this.getQuery().exec()

		this.data = item.toMutableJSON()
		this.loading = false
	}

	watch() {
		this.data_watcher = this.getQuery().$.subscribe((item) => {
			this.data = item.toMutableJSON() as DirTree.Item
		})
	}

	off() {
		this.data_watcher?.unsubscribe?.()
	}
}
