export namespace Todo {
	type Common = {
		_id: string
	}

	type Group = Common & {
		type: 'group'
		title: string
		children: Array<Todo>
	}

	type Todo = Common & {
		type: 'todo'
		text: string
		status: 'checked' | 'unchecked' | 'closed'
		checked_point: 0
	}

	export type TodoItem = Group | Todo

	export interface TodoData {
		angles: {
			[key: string]: Array<TodoItem>
		}
		archive: Array<TodoItem>
	}
}
