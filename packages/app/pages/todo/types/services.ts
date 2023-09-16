import type { Todo } from '@/types'
import type { File } from '@/models'

export type ArgsCreate = {
	file_id: string
	angle_id: string
	item: Todo.TodoItem
}

export type ArgsQueryArchives = {
	file_id: string
	page: number
}

export type ArgsUpdateTodoData = {
	file_id: string
	todo: Todo.Data
	changed_values: Partial<Todo.Data & File['data']> & {
		icon_info: { icon: string; icon_hue?: number }
	}
	values: Todo.Data & File['data']
	setTodo: (data: Todo.Data) => void
}

export type ArgsUpdate = Partial<Todo.TodoItem> & { id: string }

export type ArgsUpdateStatus = {
	id: string
	status: Todo.Todo['status']
	auto_archiving: Todo.Data['auto_archiving']
}

export type ArgsCheck = {
	file_id: string
	todo: Todo.Data
	id: string
	status: Todo.Todo['status']
}

export type ArgsUpdateRelations = {
	file_id: string
	todo: Todo.Data
	items: Array<Todo.Todo>
	active_id: string
	over_id: string
}
