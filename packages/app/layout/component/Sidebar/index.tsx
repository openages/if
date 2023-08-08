import { Tooltip } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import Avatar from 'react-nice-avatar'
import { NavLink, useLocation } from 'react-router-dom'

import { bottom_items, nav_items } from '@/appdata'
import { LogoWithBg } from '@/components'
import { useAntdApp } from '@/hooks'
import { is_mac_electron } from '@/utils'

import { useNavOverflow } from '../../hooks'
import { SidebarItem } from './components'
import styles from './index.css'

import type { IPropsSidebar } from '../../types'

const Index = (props: IPropsSidebar) => {
	const { theme, show_bar_title, avatar } = props
	const t = useTranslation()
	const { pathname } = useLocation()
	const { ref_sidebar, ref_items_wrap, overflow } = useNavOverflow()

	useAntdApp()

	const icon_weight = useMemo(() => (theme === 'light' ? 'duotone' : 'regular'), [theme])

	return (
		<div
			className={$cx(
				'fixed h_100vh border_box flex flex_column z_index_1000',
				styles._local,
				is_mac_electron && styles.is_mac_electron
			)}
			ref={ref_sidebar}
		>
			<div className='logo_wrap w_100 flex justify_center align_center'>
				<LogoWithBg className='logo' size={42}></LogoWithBg>
			</div>
			<div
				className={$cx(
					'sidebar_items flex flex_column justify_between relative',
					theme === 'dark' && 'dark'
				)}
			>
				<div className='scroll_wrap w_100'>
					<When condition={overflow}>
						<div className='scroll_mask top w_100 absolute top_0'></div>
					</When>
					<div className='sidebar_top_wrap flex flex_column' ref={ref_items_wrap}>
						{nav_items.map((item) => (
							<SidebarItem
								{...{ theme, show_bar_title, icon_weight, pathname, item }}
								key={item.title}
							></SidebarItem>
						))}
					</div>
					<When condition={overflow}>
						<div className='scroll_mask bottom w_100 sticky bottom_0'></div>
					</When>
				</div>
				<div className='sidebar_bottom_wrap flex flex_column'>
					{bottom_items.map((item) => (
						<Tooltip
							title={t(`nav_title.${item.title}`)}
							placement='right'
							destroyTooltipOnHide
							getTooltipContainer={() => document.body}
							key={item.title}
						>
							<NavLink
								className='sidebar_item clickable flex flex_column justify_center align_center transition_normal'
								to={item.path}
							>
								<item.icon
									className='icon_bar'
									size={27}
									weight={icon_weight}
								></item.icon>
							</NavLink>
						</Tooltip>
					))}
					<div className='avatar flex flex_column justify_center align_center'>
						<Avatar className='user_avatar' {...avatar}></Avatar>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
