import { observer } from 'mobx-react-lite'
import { Fragment, useMemo } from 'react'

import { widgets } from '@/appdata'
import { useGlobal } from '@/context/app'
import { Outlet } from '@umijs/max'

import { NavItem } from './components'
import styles from './layout.css'

const Index = () => {
	const global = useGlobal()

	const icon_weight = useMemo(
		() => (global.setting.theme === 'light' ? 'duotone' : 'regular'),
		[global.setting.theme]
	)

	return (
		<Fragment>
			<div
				className={$cx(
					'border_box flex justify_center fixed z_index_1000',
					styles._local,
					global.setting.theme === 'dark' && styles.dark
				)}
			>
				{widgets.map((item) => (
					<NavItem
                                    { ...{ icon_weight, item } }
						show_bar_title={global.setting.show_bar_title}
						key={item.title}
					></NavItem>
				))}
			</div>
			<Outlet></Outlet>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
