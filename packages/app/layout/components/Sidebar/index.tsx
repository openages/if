import { useMemo } from 'react'

import { LogoWithBg } from '@/components'
import { useAntdApp } from '@/hooks'
import { is_browser_shell, is_mac_electron } from '@/utils'
import { DotsNine } from '@phosphor-icons/react'

import { useNavOverflow } from '../../hooks'
import Timer from '../Timer'
import { SidebarItem } from './components'
import styles from './index.css'

import type { IPropsSidebar } from '../../types'

const Index = (props: IPropsSidebar) => {
	const { current_module, blur, theme, show_bar_title, apps, actives, timer, showAppMenu } = props

	const padding = useMemo(
		() => (theme === 'dark' || (!blur && is_mac_electron)) && !is_browser_shell,
		[theme, blur]
	)

	const { ref_sidebar, ref_items_wrap, overflow } = useNavOverflow(padding, timer)

	useAntdApp()

	return (
		<div
			className={$cx(
				'fixed h_100vh border_box flex flex_column z_index_1000',
				styles._local,
				padding && styles.is_mac_electron
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
					<If condition={overflow}>
						<div className='scroll_mask top w_100 absolute top_0'></div>
					</If>
					<div className='sidebar_top_wrap flex flex_column align_center' ref={ref_items_wrap}>
						{apps.map(item => (
							<SidebarItem
								{...{ current_module, theme, show_bar_title, item }}
								active={Boolean(actives.find(i => i.app === item.title))}
								key={item.title}
							></SidebarItem>
						))}
					</div>
					<If condition={overflow}>
						<div className='scroll_mask bottom w_100 sticky bottom_0'></div>
					</If>
				</div>
				<div className='sidebar_bottom_wrap w_100 flex flex_column align_center'>
					<Timer></Timer>
					<div className='btn_apps_wrap flex justify_center align_center'>
						<div
							className='btn_apps w_100 flex justify_center align_center clickable'
							onMouseDown={showAppMenu}
						>
							<DotsNine size={27}></DotsNine>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
