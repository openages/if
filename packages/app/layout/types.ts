import type { GlobalModel } from '@/context/app'
import type { IconProps } from '@phosphor-icons/react'
import type { App } from '@/types'

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
	is_active: boolean
}

export interface IPropsTabs {
	current_module: App.ModuleType
	stacks: GlobalModel['tabs']['stacks']
	remove: GlobalModel['tabs']['remove']
	active: GlobalModel['tabs']['active']
	update: GlobalModel['tabs']['update']
	move: GlobalModel['tabs']['move']
}

export interface IPropsTabsNavBar extends Omit<IPropsTabs, 'current_module'> {}

export interface IPropsTabsNavBarItem extends Omit<IPropsTabsNavBar, 'stacks' | 'move'> {
	item: IPropsTabsNavBar['stacks'][number]
	index: number
}

export interface IPropsTabsContent extends Pick<IPropsTabs, 'stacks'> {}

export interface IPropsAppMenu {
	visible: GlobalModel['app']['visible_app_menu']
	app_modules: GlobalModel['app']['app_modules']
	actives: GlobalModel['app']['actives']
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
