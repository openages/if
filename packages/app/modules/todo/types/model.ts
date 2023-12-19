import type { Todo } from '@/types'
import type { Dayjs } from 'dayjs'

export interface KanbanItems {
	[key: string]: {
		dimension: { type: 'angle'; value: Todo.Angle } | { type: 'tag'; value: Todo.Tag }
		items: Array<Todo.Todo>
	}
}

export type ItemsSortParams = {
	type: 'importance' | 'alphabetical' | 'create_at'
	order: 'asc' | 'desc'
}

export type ArchiveQueryParams = {
	angle_id?: string
	tags?: Array<string>
	begin_date?: Dayjs
	end_date?: Dayjs
	status?: 'unchecked' | 'closed'
}

export type Indexes = { index: number; kanban_index?: number }

export type ArgsUpdate =
	| ({ type: 'parent'; value: Partial<Omit<Todo.TodoItem, 'id'>> } & Indexes)
	| ({ type: 'children'; value: Todo.Todo['children'] } & Indexes)

export type ArgsTab = { type: 'in'; index: number } | { type: 'out'; index: number; children_index: number }
