import { throttle } from 'lodash-es'
import { useRef, useLayoutEffect, MutableRefObject } from 'react'
import { useLocation } from 'react-router-dom'

import { session } from '@openages/craftkit'

interface IScrollRestorationProps<T extends HTMLDivElement> {
	ref: MutableRefObject<T | null>
	onScroll(): void
}

export default <T extends HTMLDivElement>(id: string): IScrollRestorationProps<T> => {
	const { pathname, search, key } = useLocation()
	const ref = useRef<T>(null)
	const scroll_key = `_element_scroll_position_${pathname}${search}${id}`

	useLayoutEffect(() => {
		if (ref.current) {
			const position = session.getItem(scroll_key)

			ref.current.scrollTo(position?.scroll_left || 0, position?.scroll_top || 0)
		}
	}, [pathname, search, key])

	return {
		ref,
		onScroll: throttle(() => {
			if (ref.current) {
				session.setItem(scroll_key, {
					scroll_top: ref.current.scrollTop,
					scroll_left: ref.current.scrollLeft
				})
			}
		}, 1200)
	}
}
