import type { RxDatabase } from 'rxdb'
import type { DBModule, DBTodo, DB$TodoArchive, DB$TodoItems } from '@/schemas'

export namespace RxDB {
	export type DBContent = RxDatabase<{
		module: DBModule
		todo: DBTodo
		[key: `${string}_todo_archive`]: DB$TodoArchive
		[key: `${string}_todo_items`]: DB$TodoItems
	}>
}
