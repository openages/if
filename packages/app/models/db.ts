import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'
import { schema_dirtree_items, schema_setting, schema_todo, schema_todo_items, schema_todo_archives } from '@/schemas'

import type { RxDB } from '@/types'

@injectable()
export default class Index {
	instance = null as RxDB.DBContent | null
	ready = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		const db = await createRxDatabase<RxDB.DBContent>({
			name: 'if/db',
			eventReduce: true,
			allowSlowCount: true,
			multiInstance: true,
			cleanupPolicy: { waitForLeadership: true },
			ignoreDuplicate: window.$is_dev,
			storage: wrappedKeyCompressionStorage({
				storage: getRxStorageDexie()
			})
		})

		await db.addCollections({
			dirtree_items: { schema: schema_dirtree_items, autoMigrate: true },
			setting: { schema: schema_setting, autoMigrate: true },
			todo: { schema: schema_todo, autoMigrate: true },
			todo_items: { schema: schema_todo_items, autoMigrate: true },
			todo_archives: { schema: schema_todo_archives, autoMigrate: true }
		})

		window.$db = db
		this.instance = db

		await this.addModuleInitData()

		this.ready = true
	}

	async addModuleInitData() {
		if ((await $db.dirtree_items.count().exec()) > 0) return (this.ready = true)

		await window.$db.collections.setting.bulkInsert([{ key: 'apps', data: JSON.stringify(modules) }])

		return
	}
}
