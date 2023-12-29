import { useEventListener, useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import type { MouseEvent, RefObject } from 'react'

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

		document.body.style.cursor = 'unset'
	})

	const overflow = useMemoizedFn((v: number) => {
		if (min || max) {
			if (v <= min || v >= max) {
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
	useEventListener('mousemove', setDirTreeWidth, { target: document })
	useEventListener('mouseup', stop, { target: document })

	return draging
}
