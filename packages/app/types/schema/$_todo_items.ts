import type { Todo } from './todo'

export namespace TodoItems {
	export type Item = Todo.TodoItem & {
		/** @maxLength 30 */
		id: string
	}
}
