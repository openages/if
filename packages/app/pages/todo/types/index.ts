import type { Todo, RxDB, TodoArchive, DirTree } from '@/types'
import type Model from '../model'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<TodoArchive.Item>

export interface IProps {
	id: string
}

export interface IPropsHeader extends Pick<Todo.Data & DirTree.File, 'name' | 'icon' | 'icon_hue' | 'desc'> {
	showSettingsModal: () => void
	showArchiveModal: () => void
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	todo: Model['todo'] & Model['file']['data']
	closeSettingsModal: () => void
	updateTodo: Model['updateTodo']
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
	relations: Todo.Data['relations']
	check: Model['check']
	updateRelations: Model['updateRelations']
}

export interface IPropsTodoItem {
	item: Todo.Todo
	makeLinkLine: (args: { active_id: string; y: number } | null) => void
	check: Model['check']
	updateRelations: Model['updateRelations']
}

export interface IPropsGroupTitle {
	item: Todo.Group
}

export interface IPropsArchive {
	visible_archive_modal: Model['visible_archive_modal']
	archives: Model['archives']
	archive_counts: Model['archive_counts']
	end: Model['loadmore']['end']
	restoreArchiveItem: Model['restoreArchiveItem']
	removeArchiveItem: Model['removeArchiveItem']
	loadMore: () => void
	onClose: () => void
}

export interface IPropsArchiveItem extends Pick<IPropsArchive, 'restoreArchiveItem' | 'removeArchiveItem'> {
	item: Todo.Todo
}

export type ArgsOnInfoChange_changedValues = Partial<Todo.Data & Model['file']['data']> & {
	icon_info: { icon: string; icon_hue?: number }
}
export type ArgsOnInfoChange_values = Todo.Data & Model['file']

