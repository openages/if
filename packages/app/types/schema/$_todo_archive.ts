import type { Todo } from './todo'

export namespace TodoArchive {
	export interface Item {
		/** @maxLength 30 */
		id: string
		todo: Todo.TodoItem
	}
}
