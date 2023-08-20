import { Tooltip } from 'antd'
import { minimatch } from 'minimatch'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import { NavLink } from 'react-router-dom'

import { ModuleIcon } from '@/components'

import type { IPropsSidebarItem } from '../../../../types'

const Index = (props: IPropsSidebarItem) => {
	const { show_bar_title, icon_weight, pathname, item } = props
	const { t } = useTranslation()

	const LinkItem = (
		<NavLink
			className={$cx(
				'sidebar_item clickable flex flex_column justify_center align_center transition_normal',
				show_bar_title && 'show_bar_title',
				minimatch(pathname, `${item.path}`) && 'active'
			)}
			to={item.path}
		>
			<ModuleIcon className='icon_bar' type={item.title} size={27} weight={icon_weight}></ModuleIcon>
			<When condition={show_bar_title}>
				<span className='sidebar_item_title'>{t(`translation:modules.${item.title}`)}</span>
			</When>
		</NavLink>
	)

	if (show_bar_title) return LinkItem

	return (
		<Tooltip
			title={t(`translation:modules.${item.title}`)}
			placement='right'
			destroyTooltipOnHide
			getTooltipContainer={() => document.body}
		>
			{LinkItem}
		</Tooltip>
	)
}

export default $app.memo(Index)
