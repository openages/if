export * from './todo'

import type { TodoItem } from './todo'
import type Model from '../model'

export interface IPropsHeader {
	info: Model['info']
}

export interface IPropsTabs {
	tabs: Model['tabs']
	active_tab_index: Model['active_tab_index']
	setActiveTabIndex: Model['setActiveTabIndex']
}

export interface IPropsTodos {
	todo_items: Model['todo_items']
}

export type IPropsTodoItem = TodoItem & {}
