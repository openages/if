import { Tooltip } from 'antd'
import { When } from 'react-if'

import { ModuleIcon } from '@/components'
import { useLocale } from '@/hooks'
import { NavLink } from '@umijs/max'

import type { IPropsSidebarItem } from '../../../types'

const Index = (props: IPropsSidebarItem) => {
	const { show_bar_title, icon_weight, pathname, item } = props
	const l = useLocale()

	if (!item.checked) return null

	const LinkItem = (
		<NavLink
			className={$cx(
				'sidebar_item clickable flex flex_column justify_center align_center transition_normal',
				show_bar_title && 'show_bar_title',
				item?.match && pathname.indexOf(item?.match) !== -1 && 'active'
			)}
			to={item.path}
		>
			<ModuleIcon className='icon_bar' type={item.title} size={27} weight={icon_weight}></ModuleIcon>
			<When condition={show_bar_title}>
				<span className='sidebar_item_title'>{l(`nav_title.${item.title}`)}</span>
			</When>
		</NavLink>
	)

	if (show_bar_title) return LinkItem

	return (
		<Tooltip
			title={l(`nav_title.${item.title}`)}
			placement='right'
			destroyTooltipOnHide
                  getTooltipContainer={ () => document.body }
		>
			{LinkItem}
		</Tooltip>
	)
}

export default $app.memo(Index)
