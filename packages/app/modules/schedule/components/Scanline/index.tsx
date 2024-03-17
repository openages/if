import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import styles from './index.css'

import type { IPropsScanline } from '../../types'

const Index = (props: IPropsScanline) => {
	const { scanline, timeline, scale, step, scrollToScanline } = props
	const [offset, setOffset] = useState(0)
	const mounted = useRef(false)

	const getOffset = useMemoizedFn(() => {
		const now = dayjs()

		if (timeline) {
			let begin = null

			if (scale === 'day') begin = now.startOf('day')
			if (scale === 'week') begin = now.startOf('week')
			if (scale === 'month') begin = now.startOf('month')

			const target = (now.diff(begin, 'hours') * step) / 12

			setOffset(target)
		} else {
			const begin = now.startOf('day')
			const target = (now.diff(begin, 'minutes') * 16) / 20

			setOffset(target)
		}
	})

	useEffect(() => {
		getOffset()

		const timer_top = setInterval(() => getOffset(), 12000)

		if (timeline) {
			return () => clearInterval(timer_top)
		}

		const timer_scroll = setTimeout(() => {
			if (mounted.current) return

			scrollToScanline()

			mounted.current = true
		}, 300)

		return () => {
			clearInterval(timer_top)
			clearTimeout(timer_scroll)
		}
	}, [timeline, scale, step])

	if (timeline && !step) return null

	return (
		<div
			className={$cx('absolute', styles._local, timeline ? styles.y : styles.x)}
			style={timeline ? { left: offset + 90 } : { top: offset }}
			ref={scanline}
		></div>
	)
}

export default $app.memo(Index)
