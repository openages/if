import '@/global_css'

import { useDebounceEffect, useMemoizedFn } from 'ahooks'
import { App, ConfigProvider } from 'antd'
import { minimatch } from 'minimatch'
import { observer } from 'mobx-react-lite'
import { unstable_Activity as Activity, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { prefetchDNS } from 'react-dom'
import { IconContext } from 'react-icons'
import { useLocation, useOutlet } from 'react-router-dom'
import { container } from 'tsyringe'

import { exclude_paths, isWidget } from '@/appdata'
import { GlobalLoading, OffscreenOutlet } from '@/components'
import { GlobalContext, GlobalModel } from '@/context/app'
import { useAntdLocale, useCurrentModule, useTheme } from '@/hooks'
import { is_prod, is_sandbox } from '@/utils'
import { useDeepMemo } from '@openages/stk/react'

import { AntdApp, AppMenu, AppSwitch, Homepage, Screenlock, Search, Setting, Sidebar, Stacks } from './components'
import { useGlobalNavigate, useGlobalTranslate, usePathChange } from './hooks'
import styles from './index.css'

import type { IPropsOffscreenOutlet } from '@/components/OffscreenOutlet'
import type { AppProps } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import type {
	IPropsAppMenu,
	IPropsAppSwitch,
	IPropsSidebar,
	IPropsStacks,
	IPropsSearch,
	IPropsSetting,
	IPropsHomepage
} from './types'
import type { Stack } from '@/types'

const Index = () => {
	const { pathname } = useLocation()
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(global.setting.theme, global.setting.color_main_rgb)
	const outlet = useOutlet()!
	const locale = useAntdLocale(global.locale.lang)
	const current_module = useCurrentModule()
	const apps = $copy(global.app.apps)
	const actives = $copy(global.app.actives)
	const columns = $copy(global.stack.columns)
	const focus = $copy(global.stack.focus)
	const browser_mode = global.setting.browser_mode

	useGlobalNavigate()
	useGlobalTranslate()
	usePathChange()

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

	const showSetting = useMemoizedFn(() => (global.setting.visible = true))

	const props_sidebar: IPropsSidebar = {
		current_module,
		blur: global.layout.blur,
		theme: global.setting.theme,
		show_bar_title: global.setting.show_bar_title,
		apps,
		actives,
		showSetting
	}

	const props_config_provider: ConfigProviderProps = {
		prefixCls: 'if',
		iconPrefixCls: 'if-icon',
		theme,
		locale,
		virtual: false,
		variant: 'filled',
		getPopupContainer: n => n?.parentElement!
	}

	const props_app: AppProps = {
		prefixCls: 'if'
	}

	const props_offscreen_pages_outlet: IPropsOffscreenOutlet = {
		current_module,
		apps,
		setActives: useMemoizedFn(global.app.setActives)
	}

	const props_stacks: IPropsStacks = {
		columns: $copy(global.stack.columns),
		focus: $copy(global.stack.focus),
		container_width: global.stack.container_width,
		resizing: global.stack.resizing,
		browser_mode,
		remove: useMemoizedFn(global.stack.remove),
		click: useMemoizedFn(global.stack.click),
		update: useMemoizedFn(global.stack.update),
		move: useMemoizedFn(global.stack.move),
		resize: useMemoizedFn(global.stack.resize),
		setResizing: useMemoizedFn((v: boolean) => (global.stack.resizing = v)),
		observe: useMemoizedFn(global.stack.observe),
		unobserve: useMemoizedFn(global.stack.unobserve),
		showHomepage: useMemoizedFn(() => (global.app.visible_homepage = true)),
		showSetting
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
		apps: apps.map(item => item.title),
		open: $copy(global.search.open),
		module: $copy(global.search.module),
		items: $copy(global.search.items),
		index: $copy(global.search.index),
		history: $copy(global.search.history),
		setModule: useMemoizedFn(v => (global.search.module = v)),
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

	const props_homepage: IPropsHomepage = {
		visible_homepage: global.app.visible_homepage,
		tab: global.app.homepage_tab,
		active: global.app.homepage_active,
		apps,
		latest_files: $copy(global.app.latest_files),
		star_files: $copy(global.app.star_files),
		showSetting,
		setTab: useMemoizedFn(v => (global.app.homepage_tab = v)),
		setActive: useMemoizedFn(v => (global.app.homepage_active = v)),
		closeHomepage: useMemoizedFn(() => (global.app.visible_homepage = false)),
		setStar: useMemoizedFn(global.app.setStar),
		onFile: useMemoizedFn(v => {
			$app.Event.emit('global.stack.add', {
				id: v.id,
				module: v.module,
				file: $copy(v),
				active: true,
				fixed: false,
				outlet: null
			} as Stack.View)

			global.app.visible_homepage = false
		}),
		onStarFilesDragEnd: useMemoizedFn(global.app.onStarFilesDragEnd)
	}

	const is_widget = useMemo(() => isWidget(pathname), [pathname])

	if (!is_widget && global.screenlock.screenlock_open) {
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
						<AntdApp></AntdApp>
						<Choose>
							<When condition={is_widget}>{outlet}</When>
							<Otherwise>
								<GlobalLoading></GlobalLoading>
								<If condition={!browser_mode}>
									<Sidebar {...props_sidebar} />
								</If>
								<div
									className={$cx(
										'w_100vw border_box',
										styles.container,
										browser_mode && styles.browser_mode
									)}
								>
									<div className='w_100 border_box'>
										<If condition={!browser_mode}>
											<OffscreenOutlet {...props_offscreen_pages_outlet} />
										</If>
										<Activity mode={is_exclude_router ? 'hidden' : 'visible'}>
											<Stacks {...props_stacks}></Stacks>
										</Activity>
									</div>
								</div>
								<AppMenu {...props_app_menu}></AppMenu>
								<AppSwitch {...props_app_switch}></AppSwitch>
								<Search {...props_search}></Search>
								<Setting {...props_setting}></Setting>
								<If condition={browser_mode}>
									<Homepage {...props_homepage}></Homepage>
								</If>
							</Otherwise>
						</Choose>

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
