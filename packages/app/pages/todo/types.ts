import type { Todo, RxDB, TodoArchive, DirTree } from '@/types'
import type Services from './services'
import type Model from './model'
import type { Layer } from 'konva/lib/Layer'
import type { MutableRefObject } from 'react'

export type QueryItems = RxDB.ItemsQuery<Todo.TodoItem>
export type QueryArchives = RxDB.ItemsQuery<TodoArchive.Item>

export interface IProps {
	id: string
}

export interface IPropsHeader extends Pick<Todo.Data & DirTree.File, 'name' | 'icon' | 'icon_hue' | 'desc'> {
	showSettingsModal: () => void
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	info: Services['info'] & Services['file']['data']
	closeSettingsModal: () => void
	onInfoChange: Model['onInfoChange']
}

export interface IPropsTabs {
	angles: Services['info']['angles']
	current_angle_id: Services['current_angle_id']
	setCurrentAngleId: (id: Services['current_angle_id']) => void
}

export interface IPropsTabsItem {
	item: Services['info']['angles'][number]
	is_active: boolean
	setCurrentAngleId: IPropsTabs['setCurrentAngleId']
}

export interface IPropsInput {
	current_angle_id: Services['current_angle_id']
	loading: boolean
	tags?: Services['info']['tags']
	add: Services['add']
}

export interface IPropsInputCircle {
	circle?: Todo.Todo['circle']
	onChangeCircle: (v: IPropsInputCircle['circle']) => void
}

export interface IPropsTodos {
	items: Services['items']
}

export type IPropsTodoItem = Todo.TodoItem & {
	container: MutableRefObject<HTMLDivElement>
	layer?: Layer
}
