import { App, ConfigProvider } from 'antd'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'
import { Outlet } from '@umijs/max'

import Sidebar from './component/Sidebar'
import { useLayout, useLocales, useTheme } from './hooks'
import styles from './index.css'

import type { AppProps } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { IPropsSidebar } from './types'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(global.setting.theme, global.setting.color_main)
	const { no_dirtree } = useLayout()

	useLocales()

	useLayoutEffect(() => {
		return () => {
			$db.compact()
			$db.viewCleanup()
		}
	}, [])

	const props_sidebar: IPropsSidebar = {
		theme: global.setting.theme,
		nav_items: toJS(global.setting.nav_items),
		show_bar_title: global.setting.show_bar_title,
		avatar: global.user.avatar
	}

	const props_config_provider: ConfigProviderProps = {
		prefixCls: 'if',
		iconPrefixCls: 'if-icon',
		theme,
		getPopupContainer: (n) => n?.parentElement!
	}

	const props_app: AppProps = {
		prefixCls: 'if'
	}

	return (
		<ConfigProvider {...props_config_provider}>
			<App {...props_app}>
				<GlobalContext.Provider value={global}>
					<IconContext.Provider value={{ className: 'ricon', style: { verticalAlign: 'middle' } }}>
						<div className='w_100 border_box flex'>
							<Sidebar {...props_sidebar} />
							<div className={$cx(styles.container, no_dirtree && styles.no_dirtree)}>
								<Outlet />
							</div>
						</div>
					</IconContext.Provider>
				</GlobalContext.Provider>
			</App>
		</ConfigProvider>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
