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

export interface IPropsTabs {
	visible: boolean
	current_module: App.ModuleType
	columns: GlobalModel['stack']['columns']
	remove: GlobalModel['stack']['remove']
	click: GlobalModel['stack']['click']
	update: GlobalModel['stack']['update']
	move: GlobalModel['stack']['move']
}

export interface IPropsTabsNavBar extends Omit<IPropsTabs, 'visible' | 'current_module'> {}

export interface IPropsTabsNavBarItem extends Omit<IPropsTabsNavBar, 'stacks' | 'move'> {
	item: IPropsTabsNavBar['columns'][number]
	index: number
}

export interface IPropsTabsContent extends Pick<IPropsTabs, 'columns'> {}

export interface IPropsTabsView {
	module: App.ModuleType
	id: string
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
