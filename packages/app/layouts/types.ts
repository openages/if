import type { GlobalModel } from '@/context/app'
import type { IconProps } from '@phosphor-icons/react'

export interface IPropsSidebar {
	theme: GlobalModel['setting']['theme']
	nav_items: GlobalModel['setting']['nav_items']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	avatar: GlobalModel['user']['avatar']
}

export interface IPropsSidebarItem {
      show_bar_title: GlobalModel[ 'setting' ][ 'show_bar_title' ]
	icon_weight: IconProps['weight']
	pathname: string
	item: GlobalModel['setting']['nav_items'][number]
}
