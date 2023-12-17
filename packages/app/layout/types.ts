import type { GlobalModel } from '@/context/app'
import type { App } from '@/types'
import type { IconProps } from '@phosphor-icons/react'

export interface IPropsSidebar {
	current_module: App.ModuleType
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	apps: GlobalModel['app']['apps']
	actives: GlobalModel['app']['actives']
	showAppMenu: () => void
}

export interface IPropsSidebarItem {
	current_module: App.ModuleType
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	icon_weight: IconProps['weight']
	item: App.Module
	active: boolean
}

export interface IPropsStacks {
	visible: boolean
	current_module: App.ModuleType
	columns: GlobalModel['stack']['columns']
	focus: GlobalModel['stack']['focus']
	container_width: GlobalModel['stack']['container_width']
	resizing: GlobalModel['stack']['resizing']
	click: GlobalModel['stack']['click']
	remove: GlobalModel['stack']['remove']
	update: GlobalModel['stack']['update']
	move: GlobalModel['stack']['move']
	resize: GlobalModel['stack']['resize']
	setResizing: (v: boolean) => boolean
	observe: GlobalModel['stack']['observe']
	unobserve: GlobalModel['stack']['unobserve']
}

export interface IPropsStacksNavBar
	extends Omit<
		IPropsStacks,
		| 'visible'
		| 'current_module'
		| 'container_width'
		| 'move'
		| 'resize'
		| 'setResizing'
		| 'observe'
		| 'unobserve'
	> {
	resizing: boolean
}

export interface IPropsStacksNavBarColumn extends Omit<IPropsStacksNavBar, 'columns' | 'move'> {
	column_index: number
	column: IPropsStacksNavBar['columns'][number]
}

export interface IPropsStacksNavBarView extends Omit<IPropsStacksNavBarColumn, 'column' | 'move' | 'resizing'> {
	view_index: number
	view: IPropsStacksNavBar['columns'][number]['views'][number]
	drag_overlay?: boolean
}

export interface IPropsStacksContent
	extends Pick<IPropsStacks, 'columns' | 'container_width' | 'click' | 'resize' | 'setResizing'> {
	resizing: boolean
}

export interface IPropsStacksContentDrop {
	column_index: number
	direction: 'left' | 'right'
}

export interface IPropsStacksContentColumn {
	column_index: number
	column: IPropsStacksNavBar['columns'][number]
	width: number
	container_width: IPropsStacksContent['container_width']
	resizing: IPropsStacksContent['resizing']
	click: IPropsStacksContent['click']
	resize: IPropsStacksContent['resize']
	setResizing: IPropsStacksContent['setResizing']
}

export interface IPropsStacksContentView {
	column_index: number
	view_index: number
	view: IPropsStacksNavBar['columns'][number]['views'][number]
	width: number
	container_width: IPropsStacksContent['container_width']
	click: IPropsStacksContent['click']
}

export interface IPropsStacksView {
	column_index: number
	view_index: number
	module: App.ModuleType
	id: string
	width: number
	container_width: IPropsStacksContent['container_width']
	click: IPropsStacksContent['click']
}

export interface IPropsAppMenu {
	visible: GlobalModel['app']['visible_app_menu']
	app_modules: GlobalModel['app']['app_modules']
	actives: GlobalModel['app']['actives']
	visible_dirtree: boolean
	onClose: () => void
}

export interface IPropsAppSwitch {
	visible: GlobalModel['app']['visible_app_switch']
	actives: GlobalModel['app']['actives']
	switch_index: GlobalModel['app']['switch_index']
	changeSwitchIndex: GlobalModel['app']['changeSwitchIndex']
	handleAppSwitch: GlobalModel['app']['handleAppSwitch']
	onClose: () => void
}
