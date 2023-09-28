import type { Dayjs } from 'dayjs'
import type { Todo } from '@/types'

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

export type ArgsUpdate =
	| { type: 'parent'; index: number; value: Partial<Omit<Todo.TodoItem, 'id'>> }
	| { type: 'children'; index: number; value: Partial<Omit<Todo.Todo['children'][number], 'id'>> }
