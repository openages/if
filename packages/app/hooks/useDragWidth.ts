import { useEventListener, useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

import type { RefObject } from 'react'

interface Args {
	ref: RefObject<HTMLDivElement>
	left?: boolean
	min?: number
	max?: number
	getWidth: () => number
	setWidth: (v: number) => void
	onResizeStart?: () => void
	onResizeEnd?: () => void
}

export default (args: Args) => {
	const { ref, left, min, max, getWidth, setWidth, onResizeStart, onResizeEnd } = args
	const [draging, setDraging] = useState(false)

	const start = useMemoizedFn(() => {
		onResizeStart?.()
		setDraging(true)

		document.body.style.cursor = 'col-resize'
	})

	const stop = useMemoizedFn(() => {
		onResizeEnd?.()
		setDraging(false)

		document.body.style.removeProperty('cursor')
	})

	const overflow = useMemoizedFn((v: number) => {
		if (min || max) {
			if (v <= min! || v >= max!) {
				stop()

				return true
			}
		}

		return false
	})

	const setDirTreeWidth = useMemoizedFn((e: MouseEvent) => {
		if (!draging) return

		let width = getWidth() + (left ? -1 : 1) * e.movementX

		if (overflow(width)) return

		setWidth(width)
	})

	useEventListener('mousedown', start, { target: ref })

	useEffect(() => {
		if (!draging) return

		document.addEventListener('mousemove', setDirTreeWidth)
		document.addEventListener('mouseup', stop)

		return () => {
			document.removeEventListener('mousemove', setDirTreeWidth)
			document.removeEventListener('mouseup', stop)
		}
	}, [draging])

	return draging
}
