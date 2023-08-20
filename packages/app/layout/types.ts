import type { GlobalModel } from '@/context/app'
import type { IconProps } from '@phosphor-icons/react'
import type { App } from '@/types'

export interface IPropsSidebar {
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	apps: GlobalModel['app']['apps']
	actives: GlobalModel['app']['actives']
}

export interface IPropsSidebarItem {
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	icon_weight: IconProps['weight']
	pathname: string
	item: App.Module
	is_active: boolean
}

export interface IPropsTabs {
	stacks: GlobalModel['tabs']['stacks']
	remove: GlobalModel['tabs']['remove']
	active: GlobalModel['tabs']['active']
	update: GlobalModel['tabs']['update']
	move: GlobalModel['tabs']['move']
}

export interface IPropsTabsNavBar extends IPropsTabs {}

export interface IPropsTabsNavBarItem extends Omit<IPropsTabsNavBar, 'stacks' | 'move'> {
	item: IPropsTabsNavBar['stacks'][number]
	index: number
}

export interface IPropsTabsContent extends Pick<IPropsTabs, 'stacks'> {}
