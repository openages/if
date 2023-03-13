import type { RxDatabase } from 'rxdb'
import type { DBModule, DBTodo } from '@/schemas'

export namespace RxDB {
	export type DBContent = RxDatabase<{
		module: DBModule
		todo: DBTodo
	}>
}
