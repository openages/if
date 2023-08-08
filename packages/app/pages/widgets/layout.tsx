import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'

import { widgets } from '@/appdata'
import { useGlobal } from '@/context/app'
import { useDarkIconWeight } from '@/hooks'
import { Outlet } from '@umijs/max'

import { NavItem } from './components'
import styles from './layout.css'

const Index = () => {
	const global = useGlobal()
	const icon_weight = useDarkIconWeight()

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
						{...{ icon_weight, item }}
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
