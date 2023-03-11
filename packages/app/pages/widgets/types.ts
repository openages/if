import { widgets } from 'appdata'

import type { GlobalModel } from '@/context/app'
import type { IconProps } from '@phosphor-icons/react'

export interface IPropsNavItem {
	show_bar_title: GlobalModel['setting']['show_bar_title']
	icon_weight: IconProps['weight']
	item: (typeof widgets)[number]
}
