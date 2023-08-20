import { omit } from 'lodash-es'
import { useEffect, useState, unstable_Offscreen as Offscreen, Fragment } from 'react'
import { useOutlet, useLocation } from 'react-router-dom'

import type { App } from '@/models'
import type { App as AppType } from '@/types'
import type { ReactElement } from 'react'

export interface IPropsOffscreenOutlet {
	current_module: AppType.ModuleType
	setActives: App['setActives']
}

const Index = (props: IPropsOffscreenOutlet) => {
	const { current_module, setActives } = props
	const { pathname, key } = useLocation()
	const [cache_pages, setCachePages] = useState<Array<App['actives'][number] & { outlet: ReactElement }>>([])
	const outlet = useOutlet()

	useEffect(() => {
		const result = cache_pages.some((item) => item.pathname === pathname)

		if (result) return

		setCachePages([...cache_pages, { app: current_module, pathname, key, outlet }])
	}, [current_module, cache_pages, pathname, key, outlet])

	useEffect(() => {
		setActives(cache_pages.map((item) => omit(item, 'outlet')))
	}, [cache_pages])

	return (
		<Fragment>
			{cache_pages.map((item) => (
				<Offscreen key={item.key} mode={item.pathname === pathname ? 'visible' : 'hidden'}>
					{item.outlet}
				</Offscreen>
			))}
		</Fragment>
	)
}

export default Index
