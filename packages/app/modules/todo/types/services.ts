import type { File } from '@/models'
import type { Todo } from '@/types'
import type { MangoQuerySelector, MangoQuerySortPart } from 'rxdb'
import type Model from '../model'

export type ArgsQueryItems = {
	file_id: string
	angle_id?: string
	items_sort_param?: Model['items_sort_param']
	items_filter_tags?: Model['items_filter_tags']
	selector?: MangoQuerySelector<Todo.TodoItem>
	sort?: MangoQuerySortPart<Todo.Todo>
	table_mode?: boolean
	table_page?: number
	table_pagesize?: number
}

export type ArgsGetAnalysisData = {
	file_id: string
	analysis_duration: Model['analysis_duration']
	analysis_sort_params: Model['analysis_sort_params']
	analysis_filter_angles: Model['analysis_filter_angles']
	analysis_filter_tags: Model['analysis_filter_tags']
}

export type ArgsQueryArchives = {
	file_id: string
	page: number
}

export type ArgsUpdateTodoData = {
	file_id: string
	setting: Model['setting']
	changed_values: Partial<
		Todo.Setting &
			File['data'] & {
				icon_info: { icon: string; icon_hue?: number }
			}
	>
	values: Todo.Setting & File['data']
	setTodo: (data: Model['setting']) => void
}

export type ArgsUpdate = Partial<Todo.TodoItem> & { id: string }

export type ArgsUpdateStatus = {
	id: string
	status: Todo.Todo['status']
	auto_archiving: Todo.Setting['auto_archiving']
}

export type ArgsCheck = {
	file_id: string
	setting: Model['setting']['setting']
	id: string
	status: Todo.Todo['status']
}

export type ArgsUpdateRelations = {
	file_id: string
	setting: Model['setting']
	items: Array<Todo.Todo>
	active_id: string
	over_id: string
}
