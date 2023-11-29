import type { RxDatabase } from 'rxdb'
import type { DBDirtreeItems, DBTodo, DBTodoItems } from '@/schemas'
import type { RxDocument, RxQuery } from 'rxdb'

export namespace RxDB {
	export type DBContent = RxDatabase<{
		dirtree_items: DBDirtreeItems
		todo: DBTodo
		todo_items: DBTodoItems
	}>

	export type ItemsDoc<T> = Array<RxDocument<T>>
	export type ItemsQuery<T> = RxQuery<T, ItemsDoc<T>>
	export type SortType = 'asc' | 'desc'
}
