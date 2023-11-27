import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

import { migration_dirtree_items, migration_todo, migration_todo_items, migration_todo_archives } from '@/migrations'
import { schema_dirtree_items, schema_todo, schema_todo_items, schema_todo_archives } from '@/schemas'

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
			name: 'if/db',
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
			},
			todo_archives: {
				autoMigrate: false,
				schema: schema_todo_archives,
				migrationStrategies: migration_todo_archives
			}
		})

		window.$db = db
		this.instance = db

		await this.migrate()

		this.ready = true

		window.$app.Event.emit('app/setLoading', { visible: false })
	}

	async migrate() {
		const collections = Object.values($db.collections)
		const check_migrations = collections.map(async (item) => ((await item.migrationNeeded()) ? item : false))
		const should_migrations = (await Promise.all(check_migrations)).filter((item) => item)
		const migrations = should_migrations.map((item) => (item as RxCollection).migratePromise(30))

		if (migrations.length) {
			window.$app.Event.emit('app/setLoading', { visible: true, desc: $t('translation:app.migrating') })

			await Promise.all(migrations)
		}
	}
}
