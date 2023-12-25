import type { DBActivityItems, DBDirtreeItems, DBModuleSetting, DBTodoItems } from '@/schemas'
import type { RxDatabase } from 'rxdb'
import type { RxDocument, RxQuery } from 'rxdb'

export namespace RxDB {
	export type DBContent = RxDatabase<{
		module_setting: DBModuleSetting
		activity_items: DBActivityItems
		dirtree_items: DBDirtreeItems
		todo_items: DBTodoItems
	}>

	export type ItemsDoc<T> = Array<RxDocument<T>>
	export type ItemsQuery<T> = RxQuery<T, ItemsDoc<T>>
	export type SortType = 'asc' | 'desc'
}
