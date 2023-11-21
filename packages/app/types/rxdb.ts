import type { RxDatabase } from 'rxdb'
import type { DBDirtreeItems, DBSetting, DBTodo, DBTodoItems, DBTodoArchives } from '@/schemas'
import type { RxDocument, RxQuery } from 'rxdb'

export namespace RxDB {
	export type DBContent = RxDatabase<{
		dirtree_items: DBDirtreeItems
		setting: DBSetting
		todo: DBTodo
		todo_items: DBTodoItems
		todo_archives: DBTodoArchives
	}>

	export type ItemsDoc<T> = Array<RxDocument<T>>
	export type ItemsQuery<T> = RxQuery<T, ItemsDoc<T>>
	export type SortType = 'asc' | 'desc'
}
