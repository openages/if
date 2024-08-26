import { useMemoizedFn } from 'ahooks'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { ModuleIcon } from '@/components'

import type { MouseEvent } from 'react'
import type { IPropsSidebarItem } from '../../../../types'

const Index = (props: IPropsSidebarItem) => {
	const { current_module, show_bar_title, item, active } = props
	const { t } = useTranslation()
	const current = current_module === item.title
	const title = t(`modules.${item.title}`) as string

	const exitApp = useMemoizedFn((e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()

		if (!active) return
		if (current) return

		$app.Event.emit('global.app.exitApp', item.title)
	})

	const onClick = useMemoizedFn((e: MouseEvent) => {
		if (item.event) {
			e.preventDefault()

			$app.Event.emit(item.event)
		}
	})

	const LinkItem = (
		<NavLink
			className={$cx(
				'sidebar_item clickable flex flex_column justify_center align_center transition_normal',
				show_bar_title && 'show_bar_title',
				active && 'active',
				current && 'current'
			)}
			to={item.path}
			onContextMenu={exitApp}
			onClick={onClick}
		>
			<ModuleIcon
				className='icon_bar'
				type={item.title}
				size={27}
				weight={active ? 'duotone' : 'regular'}
			></ModuleIcon>
			<If condition={show_bar_title}>
				<span className='sidebar_item_title'>
					{current && item.short ? title.slice(0, item.short) : title}
				</span>
			</If>
		</NavLink>
	)

	if (show_bar_title) return LinkItem

	return (
		<Tooltip
			title={t(`modules.${item.title}`)}
			placement='right'
			mouseEnterDelay={0.9}
			destroyTooltipOnHide
			getTooltipContainer={() => document.body}
		>
			{LinkItem}
		</Tooltip>
	)
}

export default $app.memo(Index)
