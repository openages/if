import '@/global_css'

import { useMemoizedFn } from 'ahooks'
import { App, ConfigProvider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState } from 'react'
import { prefetchDNS } from 'react-dom'
import { IconContext } from 'react-icons'
import { useLocation, useOutlet } from 'react-router-dom'
import { container } from 'tsyringe'

import { isWidget } from '@/appdata'
import { Drawer, GlobalLoading, LazyElement } from '@/components'
import { GlobalContext, GlobalModel } from '@/context/app'
import { useAntdLocale, useCurrentModule, useTheme } from '@/hooks'
import { WinActions } from '@/layout/components'
import HomePage from '@/modules/homepage'
import { is_prod, is_sandbox, is_win_electron } from '@/utils'

import { AntdApp, HomeDrawer, Screenlock, Search, Setting, Stacks } from './components'
import { useGlobalNavigate, useGlobalTranslate, usePathChange } from './hooks'
import styles from './index.css'

import type { AppProps } from 'antd'
import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { IPropsStacks, IPropsSearch, IPropsSetting, IPropsHomeDrawer } from './types'
import type { Stack } from '@/types'

const Index = () => {
	const { pathname } = useLocation()
	const [global] = useState(() => container.resolve(GlobalModel))
	const theme = useTheme(global.setting.theme, global.setting.color_main_rgb)
	const outlet = useOutlet()!
	const locale = useAntdLocale(global.locale.lang)
	const current_module = useCurrentModule()
	const columns = $copy(global.stack.columns)

	useGlobalNavigate()
	useGlobalTranslate()
	usePathChange()

	useLayoutEffect(() => {
		if (is_prod) prefetchDNS(`https://if-server${is_sandbox ? '-sandbox' : ''}.openages.com`)

		global.init()

		return () => global.off()
	}, [])

	const showSetting = useMemoizedFn(() => (global.setting.visible = true))

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
		unobserve: useMemoizedFn(global.stack.unobserve),
		showHomeDrawer: useMemoizedFn(() => (global.app.visible_homepage = true))
	}

	const props_search: IPropsSearch = {
		current_module,
		open: $copy(global.search.open),
		module: $copy(global.search.module),
		items: $copy(global.search.items),
		index: $copy(global.search.index),
		history: $copy(global.search.history),
		setModule: useMemoizedFn(v => {
			global.search.items = []
			global.search.index = 0
			global.search.module = v
		}),
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

	const props_home_drawer: IPropsHomeDrawer = {
		tab: global.app.homepage_tab,
		active: global.app.homepage_active,
		latest_files: $copy(global.app.latest_files),
		star_files: $copy(global.app.star_files),
		showSetting,
		setTab: useMemoizedFn(v => (global.app.homepage_tab = v)),
		setActive: useMemoizedFn(v => (global.app.homepage_active = v)),
		closeHome: useMemoizedFn(() => (global.app.visible_homepage = false)),
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

	const props_modal_homepage = {
		bodyClassName: styles.modal_homepage,
		open: global.app.visible_homepage,
		maskClosable: true,
		width: 'min(240px,36vw)',
		zIndex: 1999,
		onCancel: props_home_drawer.closeHome
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
								<div className='w_100vw h_100vh border_box relative'>
									<Choose>
										<When condition={columns.length > 0}>
											<Stacks {...props_stacks}></Stacks>
										</When>
										<Otherwise>
											<div
												className='is_drag w_100 absolute z_index_10 top_0 left_0 flex justify_end'
												style={{ height: 36 }}
											>
												<If condition={is_win_electron}>
													<WinActions></WinActions>
												</If>
											</div>
											<HomePage></HomePage>
										</Otherwise>
									</Choose>
								</div>
								<Search {...props_search}></Search>
								<Setting {...props_setting}></Setting>
								<Drawer {...props_modal_homepage}>
									<HomeDrawer {...props_home_drawer}></HomeDrawer>
								</Drawer>
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
