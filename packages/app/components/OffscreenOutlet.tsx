import { useEffect, useState, unstable_Offscreen as Offscreen, Fragment } from 'react'
import { useOutlet, useLocation } from 'react-router-dom'

import type { ReactElement } from 'react'

const Index = () => {
	const { pathname, key } = useLocation()
	const [cache_pages, setCachePages] = useState<Array<{ pathname: string; key: string; outlet: ReactElement }>>([])
	const outlet = useOutlet()

	useEffect(() => {
		const result = cache_pages.some((item) => item.pathname === pathname)

		if (result) return

		setCachePages([...cache_pages, { pathname, key, outlet }])
	}, [pathname, key, outlet, cache_pages])

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
