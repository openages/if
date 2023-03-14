export namespace Todo {
	type Group = {
		type: 'group'
		title: string
		children: Array<Todo>
	}

	type Todo = {
		type: 'todo'
		text: string
		status: 'checked' | 'unchecked' | 'closed'
		achive_time: 0
	}

	export type TodoItem = Group | Todo

	export interface Data {
		/** @maxLength 30 */
		id: string
		file_id: string
		name: string
		desc?: string
		angles: { [key: string]: Array<TodoItem> }
		archive: Array<TodoItem>
	}
}
