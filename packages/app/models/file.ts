import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { find } from '@/utils/tree'

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
		return $db.module.findOne({ selector: { module: 'todo' } })
	}

	async query() {
		this.loading = true

		const target = await this.getQuery().exec()

		this.data = find(target.dirtree, this.id) as DirTree.Item

		this.loading = false
	}

	watch() {
		this.data_watcher = this.getQuery().$.subscribe(({ dirtree }) => {
			this.data = find(dirtree, this.id) as DirTree.Item
		})
	}

	off() {
		this.data_watcher?.unsubscribe?.()
	}
}
