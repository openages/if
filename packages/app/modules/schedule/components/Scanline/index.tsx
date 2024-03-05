import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import styles from './index.css'

import type { IPropsScanline } from '../../types'

const Index = (props: IPropsScanline) => {
	const { view, scanline, scrollToScanline } = props
	const [top, setTop] = useState(0)
	const mounted = useRef(false)

	const getTop = useMemoizedFn(() => {
		const now = dayjs()
		const begin = now.startOf('day')
		const target = (now.diff(begin, 'minutes') * 16) / 20

		setTop(target)
	})

	useEffect(() => {
		getTop()

		const timer_top = setInterval(() => getTop(), 12000)

		const timer_scroll = setTimeout(() => {
			if (mounted.current) return

			scrollToScanline()

			mounted.current = true
		}, 300)

		return () => {
			clearInterval(timer_top)
			clearTimeout(timer_scroll)
		}
	}, [])

	return <div className={$cx('w_100 absolute left_0', styles._local)} style={{ top }} ref={scanline}></div>
}

export default $app.memo(Index)
