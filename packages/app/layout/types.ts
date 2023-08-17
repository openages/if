import { nav_items } from '@/appdata'

import type { GlobalModel } from '@/context/app'
import type { IconProps } from '@phosphor-icons/react'

export interface IPropsSidebar {
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	avatar: GlobalModel['user']['avatar']
}

export interface IPropsSidebarItem {
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	icon_weight: IconProps['weight']
	pathname: string
	item: (typeof nav_items)[number]
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
