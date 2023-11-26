import { makeAutoObservable } from 'mobx'
import { createRxDatabase } from 'rxdb'
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'
import { migration_dirtree_items, migration_todo, migration_todo_items, migration_todo_archives } from '@/migrations'
import { schema_dirtree_items, schema_setting, schema_todo, schema_todo_items, schema_todo_archives } from '@/schemas'

import type { RxDB } from '@/types'
import type { RxCollection } from 'rxdb'

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
			dirtree_items: {
				autoMigrate: false,
				schema: schema_dirtree_items,
				migrationStrategies: migration_dirtree_items
			},
			// setting: {
			// 	autoMigrate: false,
			// 	schema: schema_setting,
			// 	migrationStrategies: migration_todo
			// },
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
		await this.addModuleInitData()

		this.ready = true

		window.$app.Event.emit('app/setLoading', { visible: false })
	}

	async addModuleInitData() {
		if ((await $db.dirtree_items.count().exec()) > 0) return (this.ready = true)

		await window.$db.collections.setting.bulkInsert([{ key: 'apps', data: JSON.stringify(modules) }])

		return
	}

	async migrate() {
		const check_migrations = Object.values($db.collections).map(async (item) => {
			const should_migrate = await item.migrationNeeded()

			return should_migrate ? item : false
		})
		const should_migrations = (await Promise.all(check_migrations)).filter((item) => item)
		const migrations = should_migrations.map((item) => (item as RxCollection).migratePromise(15))

		if (migrations.length) {
			window.$app.Event.emit('app/setLoading', { visible: true, desc: $t('translation:app.migrating') })

			await Promise.all(migrations)
		}
	}
}
