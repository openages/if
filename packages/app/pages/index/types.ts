import type { Todo, RxDB, TodoArchive } from '@/types'
import type Services from './services'
import type Model from './model'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<TodoArchive.Item>

export interface IPropsHeader extends Pick<Todo.Data, 'name' | 'desc'> {
	showSettingsModal: () => void
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	info: Todo.Data
	closeSettingsModal: () => void
}

export interface IPropsTabs {
	angles: Services['info']['angles']
	angle: Services['angle']
	setCurrentAngle: (v: Services['angle']) => void
}

export interface IPropsTodos {
	items: Services['items']
}

export type IPropsTodoItem = Todo.TodoItem & {}
