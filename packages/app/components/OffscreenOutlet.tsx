import { useMemoizedFn } from 'ahooks'
import { omit } from 'lodash-es'
import { useEffect, useState, unstable_Offscreen as Offscreen, Fragment } from 'react'
import { useOutlet, useLocation } from 'react-router-dom'

import type { GlobalModel } from '@/context/app'

import type { App } from '@/models'
import type { App as AppType } from '@/types'
import type { ReactElement } from 'react'

export interface IPropsOffscreenOutlet {
	current_module: AppType.ModuleType
	apps: GlobalModel['app']['apps']
	setActives: App['setActives']
}

const Index = (props: IPropsOffscreenOutlet) => {
	const { current_module, apps, setActives } = props
	const { pathname, key } = useLocation()
	const [cache_pages, setCachePages] = useState<
		Array<App['actives'][number] & { is_app: boolean; outlet: ReactElement }>
	>([])
	const outlet = useOutlet()

	const exitApp = useMemoizedFn((title: string) => {
		cache_pages.splice(
			cache_pages.findIndex((item) => item.app === title),
			1
		)

		setCachePages([...cache_pages])

		// @ts-ignore
		$message.success($t('translation:layout.Sidebar.exit_app_tip', { app: $t(`translation:modules.${title}`) }))
	})

	useEffect(() => {
		const result = cache_pages.some((item) => item.pathname === pathname)
		const is_app = Boolean(apps.find((item) => item.path === pathname))

		if (result || !apps.length) return

		setCachePages([...cache_pages, { app: current_module, is_app, pathname, key, outlet }])
	}, [current_module, apps, cache_pages, pathname, key, outlet])

	useEffect(() => {
		setActives(cache_pages.map((item) => omit(item, 'outlet')).filter((item) => item.is_app))
	}, [cache_pages])

	useEffect(() => {
		$app.Event.on('global.app.exitApp', exitApp)

		return () => {
			$app.Event.off('global.app.exitApp', exitApp)
		}
	}, [])

	return (
		<Fragment>
			{cache_pages.map((item) =>
				item.is_app ? (
					<Offscreen key={item.key} mode={item.pathname === pathname ? 'visible' : 'hidden'}>
						{item.outlet}
					</Offscreen>
				) : (
					item.pathname === pathname && <Fragment key={item.pathname}>{item.outlet}</Fragment>
				)
			)}
		</Fragment>
	)
}

export default Index
