import type { Todo, RxDB, TodoArchive, DirTree } from '@/types'
import type Model from '../model'
import type { SelectProps } from 'antd'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<TodoArchive.Item>

export interface IProps {
	id: string
}

export interface IPropsTagSelect {
	options: Model['todo']['tags']
	value: Array<string>
	useByTodo?: boolean
	className?: SelectProps['className']
	placement?: SelectProps['placement']
	onChange: (v: Array<string>) => void
}

export interface IPropsHeader extends Pick<Todo.Data & DirTree.File, 'name' | 'icon' | 'icon_hue' | 'desc' | 'tags'> {
	items_sort_param: Model['items_sort_param']
	items_filter_tags: Model['items_filter_tags']
	showSettingsModal: () => void
	showArchiveModal: () => void
	setItemsSortParam: (v: Model['items_sort_param']) => void
	setItemsFilterTags: (v: Model['items_filter_tags']) => void
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	todo: Model['todo'] & Model['file']['data']
	closeSettingsModal: () => void
	updateTodo: Model['updateTodo']
	removeAngle: Model['removeAngle']
	removeTag: Model['removeTag']
}

export interface IPropsTabs {
	angles: Model['todo']['angles']
	current_angle_id: Model['current_angle_id']
	setCurrentAngleId: (id: Model['current_angle_id']) => void
}

export interface IPropsTabsItem {
	item: Model['todo']['angles'][number]
	is_active: boolean
	setCurrentAngleId: IPropsTabs['setCurrentAngleId']
}

export interface IPropsInput {
	loading: boolean
	tags?: Model['todo']['tags']
	create: Model['create']
}

export interface IPropsInputCircle {
	circle_enabled: Todo.Todo['circle_enabled']
	circle_value: Todo.Todo['circle_value']
	onChangeCircle: (args: Partial<Pick<IPropsInputCircle, 'circle_enabled' | 'circle_value'>>) => void
}

export interface IPropsTodos {
	items: Model['items']
	tags: Model['todo']['tags']
	relations: Todo.Data['relations']
	drag_disabled: boolean
	check: Model['check']
	updateRelations: Model['updateRelations']
	move: Model['move']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	remove: Model['remove']
}

export interface IPropsTodoItem {
	item: Todo.Todo
	index: number
	tags: Model['todo']['tags']
	drag_disabled: boolean
	makeLinkLine: (args: { active_id: string; y: number } | null) => void
	check: Model['check']
	updateRelations: Model['updateRelations']
	insert: Model['insert']
	update: Model['update']
	tab: Model['tab']
	remove: Model['remove']
}

export interface IPropsChildren {
	items: Todo.Todo['children']
	index: number
	fold: boolean
	handled: boolean
	ChildrenContextMenu: Array<{
		key: string
		label: JSX.Element
	}>
	update: Model['update']
	tab: Model['tab']
	insertChildren: (children_index?: number) => Promise<void>
	removeChildren: (children_index: number) => Promise<void>
}

export interface IPropsChildrenItem {
	item: Todo.Todo['children'][number]
	index: number
	children_index: number
	ChildrenContextMenu: IPropsChildren['ChildrenContextMenu']
	update: (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => Promise<void>
	tab: Model['tab']
	insertChildren: (children_index?: number) => Promise<void>
	removeChildren: (children_index: number) => Promise<void>
}

export interface IPropsGroupTitle {
	item: Todo.Group
	index: number
}

export interface IPropsArchive {
	visible_archive_modal: Model['visible_archive_modal']
	archives: Model['archives']
	archive_counts: Model['archive_counts']
	end: Model['loadmore']['end']
	angles: Model['todo']['angles']
	tags: Model['todo']['tags']
	archive_query_params: Model['archive_query_params']
	loadMore: () => void
	onClose: () => void
	restoreArchiveItem: Model['restoreArchiveItem']
	removeArchiveItem: Model['removeArchiveItem']
	archiveByTime: Model['archiveByTime']
	setArchiveQueryParams: (v: Model['archive_query_params']) => void
}

export interface IPropsArchiveItem extends Pick<IPropsArchive, 'restoreArchiveItem' | 'removeArchiveItem'> {
	item: Todo.Todo
}

export type ArgsOnInfoChange_changedValues = Partial<Todo.Data & Model['file']['data']> & {
	icon_info: { icon: string; icon_hue?: number }
}
export type ArgsOnInfoChange_values = Todo.Data & Model['file']
