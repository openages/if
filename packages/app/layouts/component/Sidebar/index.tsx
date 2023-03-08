import { Tooltip } from 'antd'
import { useMemo } from 'react'
import { When } from 'react-if'
import Avatar from 'react-nice-avatar'

import { bottom_items } from '@/appdata'
import { LogoWithBg, ModuleIcon } from '@/components'
import { useLocale } from '@/hooks'
import { is_mac_electron } from '@/utils'
import { NavLink } from '@umijs/max'

import styles from './index.css'

import type { IPropsSidebar } from '../../types'

const Index = (props: IPropsSidebar) => {
	const { theme, nav_items, show_bar_title, avatar } = props
	const l = useLocale()

	const icon_weight = useMemo(() => (theme === 'light' ? 'duotone' : 'bold'), [theme])

	return (
		<div
			className={$cx(
				'fixed h_100vh border_box flex flex_column z_index_1000',
				styles._local,
				is_mac_electron && styles.is_mac_electron
			)}
		>
			<div className='logo_wrap w_100 flex justify_center align_center'>
				<LogoWithBg className='logo' size={42}></LogoWithBg>
			</div>
			<div className='sidebar_items flex flex_column justify_between'>
				<div className='sidebar_top_wrap flex flex_column'>
					{nav_items.map((item) => {
						if (!item.checked) return null

						const LinkItem = (
							<NavLink
								className={$cx(
									'sidebar_item clickable flex flex_column justify_center align_center transition_normal',
									show_bar_title && 'show_bar_title'
								)}
								to={item.path}
								key={item.title}
							>
								<ModuleIcon
									className='icon_bar'
									type={item.title}
									size={24}
									weight={icon_weight}
									fill='inherit'
								></ModuleIcon>
								<When condition={show_bar_title}>
									<span className='sidebar_item_title'>
										{l(`nav_title.${item.title}`)}
									</span>
								</When>
							</NavLink>
						)

						if (show_bar_title) return LinkItem

						return (
							<Tooltip
								title={l(`nav_title.${item.title}`)}
								placement='right'
                                                destroyTooltipOnHide
								getTooltipContainer={() => document.body}
								key={item.title}
							>
								{LinkItem}
							</Tooltip>
						)
					})}
				</div>
				<div className='sidebar_bottom_wrap flex flex_column'>
					{bottom_items.map((item) => (
						<Tooltip
							title={l(`nav_title.${item.title}`)}
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
									size={24}
									weight={icon_weight}
									fill='inherit'
								></item.icon>
							</NavLink>
						</Tooltip>
					))}
					<div className='sidebar_item avatar flex flex_column justify_center align_center'>
						<Avatar className='user_avatar' {...avatar}></Avatar>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
