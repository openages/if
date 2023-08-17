import { Popover, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import { NavLink } from 'react-router-dom'

import { modules } from '@/appdata'
import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { IPropsSidebarItem } from '../../../../types'

const Index = (props: IPropsSidebarItem) => {
	const { theme, show_bar_title, icon_weight, pathname, item } = props
	const { t } = useTranslation()

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
				<span className='sidebar_item_title'>{t(`translation:nav_title.${item.title}`)}</span>
			</When>
		</NavLink>
	)

	const Widgets = (
		<div
			className={$cx(
				'border_box flex flex_wrap',
				styles.widgets,
				theme === 'dark' && styles.dark,
				show_bar_title && styles.show_bar_title
			)}
		>
			{modules.map((item) => (
				<NavLink
					className='nav_item_wrap border_box transition_normal cursor_point'
					to={item.path}
					key={item.title}
				>
					<div className='nav_item flex flex_column align_center'>
						<ModuleIcon
							className='icon_bar'
							type={item.title}
							size={21}
							weight={icon_weight}
						></ModuleIcon>
						<When condition={show_bar_title}>
							<span className='title mt_2'>{t(`translation:nav_title.${item.title}`)}</span>
						</When>
					</div>
				</NavLink>
			))}
		</div>
	)

	if (item.title === 'widgets')
		return (
			<Popover
				content={Widgets}
				placement='right'
				destroyTooltipOnHide
				getTooltipContainer={() => document.body}
			>
				{LinkItem}
			</Popover>
		)

	if (show_bar_title) return LinkItem

	return (
		<Tooltip
			title={t(`translation:nav_title.${item.title}`)}
			placement='right'
			destroyTooltipOnHide
			getTooltipContainer={() => document.body}
		>
			{LinkItem}
		</Tooltip>
	)
}

export default $app.memo(Index)
