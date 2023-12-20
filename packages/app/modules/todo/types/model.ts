import type { Todo } from '@/types'
import type { Dayjs } from 'dayjs'

export interface KanbanItems {
	[key: string]: {
		dimension: { type: 'angle'; value: Todo.Angle } | { type: 'tag'; value: Todo.Tag }
		items: Array<Todo.Todo>
	}
}

export interface CurrentDetailIndex {
	id: string
	index: number
	dimension_id?: string
}

export interface CurrentDetailItem {
	item: Todo.Todo
	prev_id?: string
	next_id?: string
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

export type Indexes = { index: number; dimension_id?: string }

export type ArgsCheck = Indexes & { status: Todo.Todo['status'] }

export type ArgsUpdate =
	| (Indexes & { type: 'parent'; value: Partial<Omit<Todo.TodoItem, 'id'>> })
	| (Indexes & { type: 'children'; value: Todo.Todo['children'] })

export type ArgsTab = { type: 'in'; index: number } | { type: 'out'; index: number; children_index: number }
