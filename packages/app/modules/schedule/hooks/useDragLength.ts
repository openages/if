import { useEventListener, useMemoizedFn } from 'ahooks'
import { useEffect, useRef, useState } from 'react'

import type Model from '../model'

interface Args {
	type: 'timeblock' | 'timeline'
	day_index: number
	timeblock_index: number
	changeTimeBlockLength: Model['changeTimeBlockLength']
}

export default (args: Args) => {
	const { type, day_index, timeblock_index, changeTimeBlockLength } = args
	const ref = useRef<HTMLDivElement>(null)
	const changed = useRef(0)
	const [changing, setChanging] = useState(false)

	useEffect(() => {
		changed.current = 0
	}, [changing])

	const start = useMemoizedFn(() => {
		setChanging(true)

		document.body.style.cursor = type === 'timeblock' ? 'row-resize' : 'col-resize'
	})

	const stop = useMemoizedFn(() => {
		setChanging(false)

		document.body.style.cursor = 'unset'
	})

	const setWidth = useMemoizedFn((e: MouseEvent) => {
		if (!changing) return

		if (type === 'timeblock') {
			const move = e.clientY - changed.current

			if (changed.current === 0) return (changed.current = e.clientY)
			if (Math.abs(move) < 16) return

			changed.current = 0

			changeTimeBlockLength({ day_index, timeblock_index, step: move > 0 ? 1 : -1 })
		}
	})

	useEffect(() => {
		if (!changeTimeBlockLength) return

		const drag_ref = ref.current

		drag_ref.addEventListener('mousedown', start)
		document.addEventListener('mouseup', stop)

		return () => {
			drag_ref.removeEventListener('mousedown', start)
			document.removeEventListener('mouseup', stop)
		}
	}, [changeTimeBlockLength])

	useEffect(() => {
		if (changing) document.addEventListener('mousemove', setWidth)

		return () => document.removeEventListener('mousemove', setWidth)
	}, [changing])

	return { drag_ref: ref, changing }
}
