import type { Todo, RxDB, TodoArchive } from '@/types'
import type Services from './services'
import type Model from './model'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<TodoArchive.Item>

export interface IProps {
	id: string
}

export interface IPropsHeader extends Pick<Todo.Data, 'name' | 'icon' | 'desc'> {
	showSettingsModal: () => void
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	info: Todo.Data
	closeSettingsModal: () => void
	onInfoChange: Model['onInfoChange']
}

export interface IPropsTabs {
	angles: Services['info']['angles']
	angle_index: Services['angle_index']
	setCurrentAngle: (v: Services['angle_index']) => void
}

export interface IPropsTodos {
	items: Services['items']
}

export type IPropsTodoItem = Todo.TodoItem & {}
