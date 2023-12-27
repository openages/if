import {
	migration_activity_items,
	migration_dirtree_items,
	migration_module_setting,
	migration_todo_items
} from '@/migrations'
import { schema_activity_items, schema_dirtree_items, schema_module_setting, schema_todo_items } from '@/schemas'
import { debounce } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { migrateStorage } from 'rxdb/plugins/migration-storage'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

import type { RxDB } from '@/types'
import type { RxCollection } from 'rxdb'

export default class Index {
	ready = false
	instance = null as RxDB.DBContent | null

	constructor() {
		makeAutoObservable(this, { instance: false }, { autoBind: true })
	}

	async init() {
		const db = await createRxDatabase<RxDB.DBContent>({
			name: 'if_v1',
			eventReduce: true,
			allowSlowCount: true,
			multiInstance: false,
			password: 'I16DKS#hY+Two0O',
			cleanupPolicy: { waitForLeadership: false },
			ignoreDuplicate: window.$is_dev,
			storage: wrappedKeyEncryptionCryptoJsStorage({
				storage: wrappedKeyCompressionStorage({
					storage: getRxStorageDexie()
				})
			})
		})

		await db.addCollections({
			module_setting: {
				autoMigrate: false,
				schema: schema_module_setting,
				migrationStrategies: migration_module_setting
			},
			activity_items: {
				autoMigrate: false,
				schema: schema_activity_items,
				migrationStrategies: migration_activity_items
			},
			dirtree_items: {
				autoMigrate: false,
				schema: schema_dirtree_items,
				migrationStrategies: migration_dirtree_items
			},
			todo_items: {
				autoMigrate: false,
				schema: schema_todo_items,
				migrationStrategies: migration_todo_items
			}
		})

		window.$db = db
		this.instance = db

		await this.migrateSchema()

		this.ready = true

		window.$app.Event.emit('app/setLoading', { visible: false })

		this.hooks()
	}

	private async migrateRxdb() {
		window.$app.Event.emit('app/setLoading', { visible: true, desc: $t('translation:app.migrating') })

		await migrateStorage({
			oldDatabaseName: 'if_v1',
			database: window.$db as any,
			oldStorage: window.$db.storage,
			batchSize: 300,
			parallel: true
		})
	}

	private async migrateSchema() {
		const collections = Object.values($db.collections)
		const check_migrations = collections.map(async item => ((await item.migrationNeeded()) ? item : false))
		const should_migrations = (await Promise.all(check_migrations)).filter(item => item)
		const migrations = should_migrations.map(item => (item as RxCollection).migratePromise(30))

		if (migrations.length) {
			window.$app.Event.emit('app/setLoading', { visible: true, desc: $t('translation:app.migrating') })

			await Promise.all(migrations)
		}
	}

	private async updateTimeStamp(id: string, timestamp: number) {
		const doc = await $db.dirtree_items.findOne(id).exec()

		if (!doc) return

		return doc.updateCRDT({ ifMatch: { $set: { update_at: timestamp } } })
	}

	private hooks() {
		$db.module_setting.postSave(
			debounce(data => this.updateTimeStamp(data.file_id, new Date().valueOf()), 900),
			true
		)

		$db.todo_items.postSave(
			debounce(data => this.updateTimeStamp(data.file_id, new Date().valueOf()), 900),
			true
		)
	}

	off() {
		this.instance?.destroy?.()
	}
}
