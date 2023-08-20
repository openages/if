import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'
import { schema_module, schema_setting, schema_todo } from '@/schemas'

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
			multiInstance: false,
			cleanupPolicy: { waitForLeadership: false },
			ignoreDuplicate: window.$is_dev,
			storage: wrappedKeyCompressionStorage({
				storage: getRxStorageDexie()
			})
		})

		await db.addCollections({
			module: { schema: schema_module, autoMigrate: true },
			setting: { schema: schema_setting, autoMigrate: true },
			todo: { schema: schema_todo, autoMigrate: true }
		})

		window.$db = db
		this.instance = db

		await this.addModuleInitData()

		$app.Event.emit('db/ready')
	}

	async addModuleInitData() {
		if ((await $db.module.count().exec()) > 0) return (this.ready = true)

		const preset_data = modules.map((item) => ({
			module: item.title,
			dirtree: []
		}))

		await window.$db.collections.module.bulkInsert(preset_data)
		await window.$db.collections.setting.bulkInsert([{ key: 'apps', data: JSON.stringify(modules) }])

		this.ready = true

		return
	}
}
