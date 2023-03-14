import { Tooltip } from 'antd'
import { When } from 'react-if'

import { ModuleIcon } from '@/components'
import { useLocale } from '@/hooks'
import { NavLink } from '@umijs/max'

import type { IPropsNavItem } from '../types'

const Index = (props: IPropsNavItem) => {
	const { show_bar_title, icon_weight, item } = props
	const l = useLocale()

	const LinkItem = (
		<NavLink
			className={$cx('nav_item_wrap border_box flex align_center clickable relative', item.line && 'line')}
			to={item.path}
			key={item.title}
		>
			<div className='nav_item flex flex_column align_center'>
				<ModuleIcon className='icon_bar' type={item.title} size={24} weight={icon_weight}></ModuleIcon>
				<When condition={show_bar_title}>
					<span className='title mt_2'>{l(`nav_title.${item.title}`)}</span>
				</When>
			</div>
		</NavLink>
	)

	if (show_bar_title) return LinkItem

	return (
		<Tooltip
			title={l(`nav_title.${item.title}`)}
			placement='bottom'
			destroyTooltipOnHide
			getTooltipContainer={() => document.body}
		>
			{LinkItem}
		</Tooltip>
	)
}

export default $app.memo(Index)
