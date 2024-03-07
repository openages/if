import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import { NavLink } from 'react-router-dom'

import { ModuleIcon } from '@/components'

import type { MouseEvent } from 'react'
import type { IPropsSidebarItem } from '../../../../types'

const Index = (props: IPropsSidebarItem) => {
	const { current_module, show_bar_title, item, active } = props
	const { t } = useTranslation()

	const exitApp = useMemoizedFn((e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()

		if (!active) return
		if (current_module === item.title) return

		$app.Event.emit('global.app.exitApp', item.title)
	})

	const LinkItem = (
		<NavLink
			className={$cx(
				'sidebar_item clickable flex flex_column justify_center align_center transition_normal',
				show_bar_title && 'show_bar_title',
				active && 'active',
				current_module === item.title && 'current'
			)}
			to={item.path}
			onContextMenu={exitApp}
		>
			<ModuleIcon
				className='icon_bar'
				type={item.title}
				size={27}
				weight={active ? 'duotone' : 'regular'}
			></ModuleIcon>
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
