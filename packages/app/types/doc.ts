import type { DirTree } from './dirtree'
import type { Todo } from './todo'

export namespace Doc {
	export type Common = {}

	export type Todo = Common & {
		_id: 'todo'
		data: Array<DirTree.Item<Todo.TodoAngles>>
	}

	export type Memo = Common & {
		_id: 'memo'
		data: Array<any>
	}

	export type Note = Common & {
		_id: 'note'
		data: Array<any>
	}

	export type Table = Common & {
		_id: 'table'
		data: Array<any>
	}

	export type Ppt = Common & {
		_id: 'ppt'
		data: Array<any>
	}

	export type Pomodoro = Common & {
		_id: 'pomodoro'
		data: Array<any>
	}

	export type Schedule = Common & {
		_id: 'schedule'
		data: Array<any>
	}

	export type Kanban = Common & {
		_id: 'kanban'
		data: Array<any>
	}

	export type Flow = Common & {
		_id: 'flow'
		data: Array<any>
	}

	export type Board = Common & {
		_id: 'board'
		data: Array<any>
	}

	export type Project = Common & {
		_id: 'project'
		data: Array<any>
	}

	export type Content =
		| Todo
		| Memo
		| Note
		| Table
		| Ppt
		| Pomodoro
		| Schedule
		| Kanban
		| Kanban
		| Flow
		| Board
		| Board
		| Project
}
