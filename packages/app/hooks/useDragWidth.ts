import { useEventListener, useMemoizedFn } from 'ahooks'
import { Decimal } from 'decimal.js'
import { useState } from 'react'

import type { MouseEvent, RefObject } from 'react'

export default (
	ref: RefObject<HTMLDivElement>,
	getWidth: () => number,
	setWidth: (v: number) => void,
	left?: boolean
) => {
	const [draging, setDraging] = useState(false)

	const setDirTreeWidth = useMemoizedFn((e: MouseEvent) => {
		if (!draging) return

		setWidth(getWidth() + (left ? -1 : 1) * new Decimal(new Decimal(e.movementX).toFixed(2)).toNumber())
	})

	useEventListener('mousedown', () => setDraging(!draging), { target: ref })
	useEventListener('mouseup', () => setDraging(false), { target: document })
	useEventListener('mousemove', setDirTreeWidth, { target: document })

	return draging
}
