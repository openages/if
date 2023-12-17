import { useEventListener, useMemoizedFn } from 'ahooks'
import { Decimal } from 'decimal.js'
import { useState } from 'react'

import type { MouseEvent, RefObject } from 'react'

interface Args {
	ref: RefObject<HTMLDivElement>
	left?: boolean
	getWidth: () => number
	setWidth: (v: number) => void
	onResizeStart?: () => void
	onResizeEnd?: () => void
}

export default (args: Args) => {
	const { ref, left, getWidth, setWidth, onResizeStart, onResizeEnd } = args
	const [draging, setDraging] = useState(false)

	const setDirTreeWidth = useMemoizedFn((e: MouseEvent) => {
		if (!draging) return

		setWidth(getWidth() + (left ? -1 : 1) * new Decimal(new Decimal(e.movementX).toFixed(2)).toNumber())
	})

	useEventListener(
		'mousedown',
		() => {
			onResizeStart?.()
			setDraging(true)
		},
		{ target: ref }
	)

	useEventListener(
		'mouseup',
		() => {
			onResizeEnd?.()
			setDraging(false)
		},
		{ target: document }
	)

	useEventListener('mousemove', setDirTreeWidth, { target: document })

	return draging
}
