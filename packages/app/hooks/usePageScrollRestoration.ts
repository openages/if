import { useMemoizedFn } from 'ahooks'
import { throttle } from 'lodash-es'
import { useLayoutEffect, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { session } from '@openages/stk'

import type { App } from '@/types'

export default (id: string, stacks: App.Stacks) => {
	const { pathname } = useLocation()
	const scroll_key = `_page_scroll_position_${pathname}_${id}`

	const active_id = useMemo(() => stacks.find((item) => item.is_active)?.id, [stacks])

	const scrollHandler = useMemoizedFn(
		throttle(() => {
			if (id !== active_id) return

			session.setItem(scroll_key, {
				scroll_top: window.scrollY,
				scroll_left: window.scrollX
			})
		}, 900)
	)

	useLayoutEffect(() => {
		window.addEventListener('scroll', scrollHandler)

		return () => {
			window.removeEventListener('scroll', scrollHandler)
		}
	}, [id, scroll_key, active_id])

	useEffect(() => {
            const position = session.getItem(scroll_key)
            
            if (!position) return
            
		window.scrollTo(position?.scroll_left || 0, position?.scroll_top || 0)
	}, [scroll_key])
}
