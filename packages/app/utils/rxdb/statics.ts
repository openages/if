import type { KeyFunctionMap, DexieStorageInternals, RxStorageInstance } from 'rxdb'

export default {
	async clean(primary_value: string | number) {
		// @ts-ignore
		const storage = await (this.internalStorageInstance.internals as Promise<DexieStorageInternals>)

		const target = await this.findOne(primary_value).exec()

		await target.remove()
		await storage.dexieTable.delete(primary_value)
	},
	async getRemovedItems<T = any>() {
		// @ts-ignore
		const storage = await (this.internalStorageInstance.internals as Promise<DexieStorageInternals>)

		return storage.dexieTable.where('_deleted').equals('1').toArray() as Promise<Array<T>>
	},
	async bulkClean(primary_values?: Array<string | number>) {
		// @ts-ignore
		const storage = await (this.internalStorageInstance.internals as Promise<DexieStorageInternals>)

		await storage.dexieDb.transaction('rw', storage.dexieTable, async () => {
			if (primary_values) {
				await storage.dexieTable.bulkDelete(primary_values)
			} else {
				const remove_items = await storage.dexieTable.where('_deleted').equals('1').toArray()

				// @ts-ignore
				await storage.dexieTable.bulkDelete(remove_items.map(item => item[this.schema.primaryPath]))
			}
		})
	}
} as KeyFunctionMap
