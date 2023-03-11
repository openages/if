import type { Todo } from '@/types'
import type Model from '../model'

export interface IPropsHeader extends Pick<Todo.TodoList, 'name' | 'desc'> {}

export interface IPropsTabs {
	angles: Model['angles']
	current_angle: Model['current_angle']
	setCurrentAngle: (v: Model['current_angle']) => void
}

export interface IPropsTodos {
	todo_items: Model['todo_items']
}

export type IPropsTodoItem = Todo.TodoItem & {}
