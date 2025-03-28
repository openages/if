import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import styles from './index.css'

import type { IPropsScanline } from '../../types'

const Index = (props: IPropsScanline) => {
	const { scanline, timeline, step, start_day, scrollToScanline } = props
	const [offset, setOffset] = useState<number | string>(0)
	const mounted = useRef(false)

	const getOffset = useMemoizedFn(() => {
		const now = dayjs()

		if (timeline) {
			let begin = null

			begin = dayjs(start_day)

			const target = (now.diff(begin, 'hours') * step!) / 24

			setOffset(target + 90)
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

			scrollToScanline?.()

			mounted.current = true
		}, 300)

		return () => {
			clearInterval(timer_top)
			clearTimeout(timer_scroll)
		}
	}, [timeline, step, start_day])

	if (timeline && !step) return null

	return (
		<div
			className={$cx('absolute', styles._local, timeline ? styles.y : styles.x)}
			style={timeline ? { left: offset } : { top: offset }}
			ref={scanline}
		></div>
	)
}

export default $app.memo(Index)
