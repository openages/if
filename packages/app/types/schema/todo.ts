export namespace Todo {
	type Common = {}

	type Group = Common & {
		type: 'group'
		title: string
		children: Array<Todo>
	}

	type Todo = Common & {
		type: 'todo'
		text: string
		status: 'checked' | 'unchecked' | 'closed'
		achive_time: number
	}

	export type TodoItem = Group | Todo

	export interface Data {
		/** @maxLength 30 */
		id: string
		name: string
		desc?: string
		angles: { [key: string]: Array<TodoItem> }
		archive: string
	}
}
