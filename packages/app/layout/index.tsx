import '@/global_css'

import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, App } from 'antd'
import { minimatch } from 'minimatch'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, useMemo, unstable_Offscreen as Offscreen, Fragment } from 'react'
import { IconContext } from 'react-icons'
import { useLocation } from 'react-router-dom'
import { container } from 'tsyringe'

import { exclude_paths } from '@/appdata'
import { OffscreenPagesOutlet, Loading } from '@/components'
import { GlobalContext, GlobalModel } from '@/context/app'
import { useTheme, useAntdLocale } from '@/hooks'

import { Sidebar, Tabs } from './component'
import { useLayout, useGlobalTranslate } from './hooks'
import styles from './index.css'

import type { AppProps } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { IPropsSidebar, IPropsTabs } from './types'

const Index = () => {
	const { pathname } = useLocation()
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(global.setting.theme, global.setting.color_main_rgb)
	const locale = useAntdLocale(global.locale.lang)
	const { no_dirtree } = useLayout()
	const apps = toJS(global.app.apps)
	const actives = toJS(global.app.actives)

	useGlobalTranslate()

	useLayoutEffect(() => {
		global.init()

		return () => global.off()
	}, [])

	const is_exclude_router = useMemo(() => exclude_paths.some((item) => minimatch(pathname, item)), [pathname])

	const target_apps = useMemo(
		() =>
			apps.filter((item) => {
				if (item.is_fixed) return true
				if (actives.includes(item.title)) return true

				return false
			}),
		[apps, actives]
	)

	const props_sidebar: IPropsSidebar = {
		theme: global.setting.theme,
		show_bar_title: global.setting.show_bar_title,
		apps: target_apps,
		actives
	}

	const props_config_provider: ConfigProviderProps = {
		prefixCls: 'if',
		iconPrefixCls: 'if-icon',
		theme,
		locale,
		getPopupContainer: (n) => n?.parentElement!
	}

	const props_app: AppProps = {
		prefixCls: 'if'
	}

	const props_tabs: IPropsTabs = {
		stacks: toJS(global.tabs.stacks),
		remove: useMemoizedFn(global.tabs.remove),
		active: useMemoizedFn(global.tabs.active),
		update: useMemoizedFn(global.tabs.update),
		move: useMemoizedFn(global.tabs.move)
	}

	if (!global.db.ready) return <Loading></Loading>

	return (
		<GlobalContext.Provider value={global}>
			<ConfigProvider {...props_config_provider}>
				<App {...props_app}>
					<IconContext.Provider value={{ className: 'ricon', style: { verticalAlign: 'middle' } }}>
						<div className='w_100 border_box flex'>
							<Sidebar {...props_sidebar} />
							<div className={$cx(styles.container, no_dirtree && styles.no_dirtree)}>
								<OffscreenPagesOutlet />
								<Offscreen
									key='global_tabs'
									mode={!is_exclude_router ? 'visible' : 'hidden'}
								>
									<Tabs {...props_tabs}></Tabs>
								</Offscreen>
							</div>
						</div>
					</IconContext.Provider>
				</App>
			</ConfigProvider>
		</GlobalContext.Provider>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
