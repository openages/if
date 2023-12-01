import { useMemo } from 'react'
import { When } from 'react-if'

import { LogoWithBg } from '@/components'
import { useAntdApp } from '@/hooks'
import { is_mac_electron } from '@/utils'
import { DotsNine } from '@phosphor-icons/react'

import { useNavOverflow } from '../../hooks'
import { SidebarItem } from './components'
import styles from './index.css'

import type { IPropsSidebar } from '../../types'

const Index = (props: IPropsSidebar) => {
	const { current_module, theme, show_bar_title, apps, actives, showAppMenu } = props
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
					<div className='sidebar_top_wrap flex flex_column align_center' ref={ref_items_wrap}>
						{apps.map(item => (
							<SidebarItem
								{...{ current_module, theme, show_bar_title, icon_weight, item }}
								is_active={Boolean(actives.find(i => i.app === item.title))}
								key={item.title}
							></SidebarItem>
						))}
					</div>
					<When condition={overflow}>
						<div className='scroll_mask bottom w_100 sticky bottom_0'></div>
					</When>
				</div>
				<div className='sidebar_bottom_wrap w_100 flex flex_column'>
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
