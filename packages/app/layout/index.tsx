import '@/global_css'

import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, App } from 'antd'
import { minimatch } from 'minimatch'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, useMemo, useEffect } from 'react'
import { IconContext } from 'react-icons'
import { useLocation } from 'react-router-dom'
import { container } from 'tsyringe'

import { exclude_paths } from '@/appdata'
import { OffscreenOutlet, Loading } from '@/components'
import { GlobalContext, GlobalModel } from '@/context/app'
import { useTheme, useAntdLocale, useCurrentModule } from '@/hooks'

import { Sidebar, Tabs, AppMenu, AppSwitch } from './component'
import { useLayout, useGlobalNavigate, useGlobalTranslate } from './hooks'
import styles from './index.css'

import type { AppProps } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { IPropsSidebar, IPropsTabs, IPropsAppMenu, IPropsAppSwitch } from './types'
import type { IPropsOffscreenOutlet } from '@/components/OffscreenOutlet'

const Index = () => {
	const { pathname } = useLocation()
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(global.setting.theme, global.setting.color_main_rgb)
	const locale = useAntdLocale(global.locale.lang)
	const { no_dirtree } = useLayout()
	const current_module = useCurrentModule()
	const apps = toJS(global.app.apps)
	const actives = toJS(global.app.actives)

	useGlobalNavigate()
	useGlobalTranslate()

	useLayoutEffect(() => {
		global.init()

		return () => global.off()
	}, [])

	useEffect(() => {
		global.app.switch_index = global.app.actives.findIndex((item) => item.app === current_module)
	}, [current_module, global.app.actives])

	const is_exclude_router = useMemo(() => exclude_paths.some((item) => minimatch(pathname, item)), [pathname])

	const props_sidebar: IPropsSidebar = {
		current_module,
		theme: global.setting.theme,
		show_bar_title: global.setting.show_bar_title,
		apps,
		actives,
		showAppMenu: useMemoizedFn(() => (global.app.visible_app_menu = true))
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

	const props_offscreen_pages_outlet: IPropsOffscreenOutlet = {
		current_module,
		apps: toJS(global.app.app_modules),
		setActives: useMemoizedFn(global.app.setActives)
	}

	const props_tabs: IPropsTabs = {
		visible: !is_exclude_router,
		current_module,
		stacks: toJS(global.tabs.stacks),
		remove: useMemoizedFn(global.tabs.remove),
		active: useMemoizedFn(global.tabs.active),
		update: useMemoizedFn(global.tabs.update),
		move: useMemoizedFn(global.tabs.move)
	}

	const props_app_menu: IPropsAppMenu = {
		visible: global.app.visible_app_menu,
		app_modules: toJS(global.app.app_modules),
		actives,
		onClose: useMemoizedFn(() => (global.app.visible_app_menu = false))
	}

	const props_app_switch: IPropsAppSwitch = {
		visible: global.app.visible_app_switch,
		switch_index: global.app.switch_index,
		actives,
		onClose: useMemoizedFn(() => (global.app.visible_app_switch = false)),
		changeSwitchIndex: useMemoizedFn(global.app.changeSwitchIndex),
		handleAppSwitch: useMemoizedFn(global.app.handleAppSwitch)
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
								<OffscreenOutlet {...props_offscreen_pages_outlet} />
								<Tabs {...props_tabs}></Tabs>
							</div>
						</div>
						<AppMenu {...props_app_menu}></AppMenu>
						<AppSwitch {...props_app_switch}></AppSwitch>
					</IconContext.Provider>
				</App>
			</ConfigProvider>
		</GlobalContext.Provider>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
