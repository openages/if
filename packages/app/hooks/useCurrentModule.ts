import { useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { default_nav_items } from '@/appdata'

import type { App } from '@/types'

export default () => {
	const { pathname } = useLocation()

	return useMemo(() => {
		let target_index = null as number | null

		default_nav_items.map((item, index) => {
			if (matchPath(item.path, pathname)) {
				target_index = index
			}
		})

		return default_nav_items[target_index || 0].title
	}, [pathname]) as App.ModuleType
}
