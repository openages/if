import { nav_items } from '@/appdata'

import type { GlobalModel } from '@/context/app'
import type { IconProps } from '@phosphor-icons/react'


export interface IPropsSidebar {
	theme: GlobalModel['setting']['theme']
	show_bar_title: GlobalModel['setting']['show_bar_title']
      avatar: GlobalModel[ 'user' ][ 'avatar' ]
      nav_items:typeof nav_items
}

export interface IPropsSidebarItem {
      show_bar_title: GlobalModel[ 'setting' ][ 'show_bar_title' ]
	icon_weight: IconProps['weight']
	pathname: string
	item: (typeof nav_items)[number]
}
