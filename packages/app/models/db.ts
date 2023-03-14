import { dropRight } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { injectable } from 'tsyringe'

import { nav_items, widgets } from '@/appdata'
import { schema_module, schema_todo } from '@/schemas'

import type { RxDB, App } from '@/types'

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
			password: '+13439882350j',
			storage: wrappedKeyCompressionStorage({
				storage: wrappedKeyEncryptionCryptoJsStorage({ storage: getRxStorageDexie() })
			}),
			cleanupPolicy: { waitForLeadership: false }
		})

		await db.addCollections({
			module: { schema: schema_module },
			todo: { schema: schema_todo }
		})

		window.$db = db
		this.instance = db

		this.addModuleInitData()
	}

	async addModuleInitData() {
		if ((await $db.module.count().exec()) > 0) return (this.ready = true)

		const preset_data = [...dropRight(nav_items), ...widgets].map((item) => ({
			module: item.title as Exclude<App.ModuleType, 'widgets'>,
			dirtree: []
		}))

		window.$db.collections.module.bulkInsert(preset_data)

		this.ready = true
	}
}
