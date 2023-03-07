import type { GlobalModel } from '@/context/app'

export interface IPropsSidebar {
	theme: GlobalModel['setting']['theme']
	nav_items: GlobalModel['setting']['nav_items']
	show_bar_title: GlobalModel['setting']['show_bar_title']
	avatar: GlobalModel['user']['avatar']
}
