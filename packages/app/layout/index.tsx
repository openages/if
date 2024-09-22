import '@/global_css'

import { useDebounceEffect, useMemoizedFn } from 'ahooks'
import { App, ConfigProvider } from 'antd'
import { minimatch } from 'minimatch'
import { observer } from 'mobx-react-lite'
import { unstable_Activity as Activity, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { prefetchDNS } from 'react-dom'
import { IconContext } from 'react-icons'
import { useLocation } from 'react-router-dom'
import { container } from 'tsyringe'

import { exclude_paths } from '@/appdata'
import { GlobalLoading, LazyElement, OffscreenOutlet } from '@/components'
import { GlobalContext, GlobalModel } from '@/context/app'
import { useAntdLocale, useCurrentModule, useTheme } from '@/hooks'
import { is_prod, is_sandbox } from '@/utils'
import { useDeepMemo } from '@openages/stk/react'

import { AppMenu, AppSwitch, Screenlock, Search, Setting, Sidebar, Stacks } from './components'
import { useGlobalNavigate, useGlobalTranslate, useLayout } from './hooks'
import styles from './index.css'

import type { IPropsOffscreenOutlet } from '@/components/OffscreenOutlet'
import type { AppProps } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { IPropsAppMenu, IPropsAppSwitch, IPropsSidebar, IPropsStacks, IPropsSearch, IPropsSetting } from './types'

const Index = () => {
	const { pathname } = useLocation()
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(global.setting.theme, global.setting.color_main_rgb)
	const locale = useAntdLocale(global.locale.lang)
	const { no_dirtree } = useLayout()
	const current_module = useCurrentModule()
	const apps = $copy(global.app.apps)
	const actives = $copy(global.app.actives)
	const columns = $copy(global.stack.columns)
	const focus = $copy(global.stack.focus)

	useGlobalNavigate()
	useGlobalTranslate()

	useLayoutEffect(() => {
		if (is_prod) prefetchDNS(`https://if-server${is_sandbox ? '-sandbox' : ''}.openages.com`)

		global.init()

		return () => global.off()
	}, [])

	useEffect(() => {
		global.app.switch_index = global.app.actives.findIndex(item => item.app === current_module)
	}, [current_module, global.app.actives])

	useEffect(() => {
		global.search.module = current_module
	}, [current_module])

	const focus_file = useDeepMemo(() => {
		if (focus.column === -1 || focus.view === -1) return {}

		return columns[focus.column]?.views?.[focus.view]?.file || {}
	}, [columns, focus])

	useDebounceEffect(() => {
		$app.Event.emit(`${current_module}/dirtree/setCurrentItem`, focus_file)
	}, [current_module, focus_file])

	const is_exclude_router = useMemo(() => exclude_paths.some(item => minimatch(pathname, item)), [pathname])

	const props_sidebar: IPropsSidebar = {
		current_module,
		blur: global.layout.blur,
		theme: global.setting.theme,
		show_bar_title: global.setting.show_bar_title,
		apps,
		actives,
		timer: $copy(global.timer.timer),
		showAppMenu: useMemoizedFn(() => (global.app.visible_app_menu = true))
	}

	const props_config_provider: ConfigProviderProps = {
		prefixCls: 'if',
		iconPrefixCls: 'if-icon',
		theme,
		locale,
		virtual: false,
		getPopupContainer: n => n?.parentElement!
	}

	const props_app: AppProps = {
		prefixCls: 'if'
	}

	const props_offscreen_pages_outlet: IPropsOffscreenOutlet = {
		current_module,
		apps: $copy(global.app.app_modules),
		setActives: useMemoizedFn(global.app.setActives)
	}

	const props_stacks: IPropsStacks = {
		columns: $copy(global.stack.columns),
		focus: $copy(global.stack.focus),
		container_width: global.stack.container_width,
		resizing: global.stack.resizing,
		remove: useMemoizedFn(global.stack.remove),
		click: useMemoizedFn(global.stack.click),
		update: useMemoizedFn(global.stack.update),
		move: useMemoizedFn(global.stack.move),
		resize: useMemoizedFn(global.stack.resize),
		setResizing: useMemoizedFn((v: boolean) => (global.stack.resizing = v)),
		observe: useMemoizedFn(global.stack.observe),
		unobserve: useMemoizedFn(global.stack.unobserve)
	}

	const props_app_menu: IPropsAppMenu = {
		visible: global.app.visible_app_menu,
		app_modules: $copy(global.app.app_modules),
		actives,
		visible_dirtree: global.layout.dirtree_width !== 0,
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

	const props_search: IPropsSearch = {
		current_module,
		open: $copy(global.search.open),
		module: $copy(global.search.module),
		items: $copy(global.search.items),
		index: $copy(global.search.index),
		history: $copy(global.search.history),
		searchByInput: useMemoizedFn(global.search.searchByInput),
		onClose: useMemoizedFn(global.search.closeSearch),
		onCheck: useMemoizedFn(global.search.onCheck),
		changeSearchIndex: useMemoizedFn(global.search.changeSearchIndex),
		clearSearchHistory: useMemoizedFn(global.search.clearSearchHistory)
	}

	const props_setting: IPropsSetting = {
		visible: global.setting.visible,
		onClose: useMemoizedFn(() => (global.setting.visible = false))
	}

	if (global.screenlock.screenlock_open) {
		return (
			<GlobalContext.Provider value={global}>
				<Screenlock></Screenlock>
			</GlobalContext.Provider>
		)
	}

	if (!global.db.ready) return <GlobalLoading visible></GlobalLoading>

	return (
		<GlobalContext.Provider value={global}>
			<ConfigProvider {...props_config_provider}>
				<App {...props_app}>
					<IconContext.Provider value={{ className: 'ricon', style: { verticalAlign: 'middle' } }}>
						<GlobalLoading></GlobalLoading>
						<Sidebar {...props_sidebar} />
						<div
							className={$cx(
								'w_100vw border_box',
								styles.container,
								no_dirtree && styles.no_dirtree
							)}
						>
							<div className='w_100 border_box'>
								<OffscreenOutlet {...props_offscreen_pages_outlet} />
								<Activity mode={is_exclude_router ? 'hidden' : 'visible'}>
									<Stacks {...props_stacks}></Stacks>
								</Activity>
							</div>
						</div>
						<AppMenu {...props_app_menu}></AppMenu>
						<AppSwitch {...props_app_switch}></AppSwitch>
						<Search {...props_search}></Search>
						<Setting {...props_setting}></Setting>
						{/* {process.env.NODE_ENV === 'development' && (
                                   <LazyElement type='dev' path=''></LazyElement>
                             )} */}
					</IconContext.Provider>
				</App>
			</ConfigProvider>
		</GlobalContext.Provider>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
