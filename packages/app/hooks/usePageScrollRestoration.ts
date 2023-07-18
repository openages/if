import { useMemoizedFn } from 'ahooks'
import { throttle } from 'lodash-es'
import { useLayoutEffect } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

import { session } from '@openages/craftkit'

export default () => {
	const { pathname, search, key } = useLocation()
	const { state } = useNavigation()
	const scroll_key = `_page_scroll_position_${pathname}${search}`

	const scrollHandler = useMemoizedFn(
		throttle(() => {
			session.setItem(scroll_key, {
				scroll_top: window.scrollY,
				scroll_left: window.scrollX
			})
		}, 1200)
	)

	useLayoutEffect(() => {
		window.addEventListener('scroll', scrollHandler)

		return () => {
			window.removeEventListener('scroll', scrollHandler)
		}
	}, [])

	useLayoutEffect(() => {
		if (state !== 'idle') return

		const position = session.getItem(scroll_key)

		window.scrollTo(position?.scroll_left || 0, position?.scroll_top || 0)
	}, [pathname, search, key, state])
}
