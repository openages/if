import { migration_activity_items, migration_dirtree_items, migration_todo, migration_todo_items } from '@/migrations'
import { schema_activity_items, schema_dirtree_items, schema_todo, schema_todo_items } from '@/schemas'
import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { migrateStorage } from 'rxdb/plugins/migration-storage'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

import type { RxDB } from '@/types'
import type { RxCollection } from 'rxdb'

export default class Index {
	instance = null as RxDB.DBContent | null
	ready = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		const db = await createRxDatabase<RxDB.DBContent>({
			name: 'if_v1',
			eventReduce: true,
			allowSlowCount: true,
			multiInstance: true,
			password: 'I16DKS#hY+Two0O',
			cleanupPolicy: { waitForLeadership: true },
			ignoreDuplicate: window.$is_dev,
			storage: wrappedKeyEncryptionCryptoJsStorage({
				storage: wrappedKeyCompressionStorage({
					storage: getRxStorageDexie()
				})
			})
		})

		await db.addCollections({
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
			todo: {
				autoMigrate: false,
				schema: schema_todo,
				migrationStrategies: migration_todo
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

	async migrateRxdb() {
		window.$app.Event.emit('app/setLoading', { visible: true, desc: $t('translation:app.migrating') })

		await migrateStorage({
			oldDatabaseName: 'if_v1',
			database: window.$db as any,
			oldStorage: window.$db.storage,
			batchSize: 300,
			parallel: true
		})
	}

	async migrateSchema() {
		const collections = Object.values($db.collections)
		const check_migrations = collections.map(async item => ((await item.migrationNeeded()) ? item : false))
		const should_migrations = (await Promise.all(check_migrations)).filter(item => item)
		const migrations = should_migrations.map(item => (item as RxCollection).migratePromise(30))

		if (migrations.length) {
			window.$app.Event.emit('app/setLoading', { visible: true, desc: $t('translation:app.migrating') })

			await Promise.all(migrations)
		}
	}

	async updateTimeStamp(id: string) {
		const doc = await $db.dirtree_items.findOne(id).exec()

		return doc.updateCRDT({ ifMatch: { $set: { update_at: new Date().valueOf() } } })
	}

	hooks() {
		$db.dirtree_items.postInsert(
			(_, doc) => doc.updateCRDT({ ifMatch: { $set: { create_at: new Date().valueOf() } } }),
			false
		)

		$db.todo.postSave(async data => this.updateTimeStamp(data.id), false)
		$db.todo_items.postSave(async data => this.updateTimeStamp(data.file_id), false)
	}
}
