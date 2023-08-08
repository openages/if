import { useEventListener, useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import { getComputedStyleValue } from '@/utils'

import type { MouseEvent, RefObject } from 'react'

export default (ref: RefObject<HTMLDivElement>, css_var: string, setWidth: (v: number) => void) => {
	const [draging, setDraging] = useState(false)

	const setDirTreeWidth = useMemoizedFn((e: MouseEvent) => {
		if (!draging) return

		const width = getComputedStyleValue(document.documentElement, css_var)

		setWidth(width + e.movementX)
	})

	useEventListener('mousedown', () => setDraging(!draging), { target: ref })
	useEventListener('mouseup', () => setDraging(false), { target: document })
	useEventListener('mousemove', setDirTreeWidth, { target: ref })
	useEventListener('mousemove', setDirTreeWidth, { target: document })

	return draging
}
