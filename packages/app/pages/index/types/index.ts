import type { Todo, RxDB, TodoArchive } from '@/types'
import type Model from '../model'
import type Services from '../services'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<TodoArchive.Item>

export interface IPropsHeader extends Pick<Todo.Data, 'name' | 'desc'> {}

export interface IPropsTabs {
	angles: Services['info']['angles']
	angle: Services['angle']
	setCurrentAngle: (v: Services['angle']) => void
}

export interface IPropsTodos {
	items: Services['items']
}

export type IPropsTodoItem = Todo.TodoItem & {}
