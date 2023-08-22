import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { find } from '@/utils/tree'

import type { Module, DirTree } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'

@injectable()
export default class Index {
	id = ''
	data_query = {} as RxQuery<Module.Item>
	data = {} as DirTree.File
	loading = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async query(id: string) {
		this.id = id
		this.loading = true

		this.data_query = $db.module.findOne({ selector: { module: 'todo' } })! as RxQuery<Module.Item>

		const target = (await this.data_query.exec()) as RxDocument<Module.Item>

		this.data = find(target.dirtree, this.id) as DirTree.File

		target.$.subscribe(({ dirtree }) => {
			this.data = find(dirtree, this.id) as DirTree.File
		})

		this.loading = false
	}

	off() {
		this.data_query?.$?.unsubscribe?.()
	}
}
