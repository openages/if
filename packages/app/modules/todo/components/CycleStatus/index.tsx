import { Progress } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import styles from './index.css'

import type { IPropsCircleStatus } from '../../types'

const Index = (props: IPropsCircleStatus) => {
	const { cycle, recycle_time, useByArchive } = props
	const [percent, setPercent] = useState(0)

	useEffect(() => {
		const duration =
			(cycle.scale === 'quarter'
				? dayjs.duration(cycle.interval, 'month').asSeconds() * 3
				: dayjs.duration(cycle.interval, cycle.scale).asSeconds()) * 1000

		const timer = setInterval(() => {
			const now = new Date().valueOf()

			if (now >= recycle_time) {
				setPercent(100)

				window.$app.Event.emit('todo/cycleByTime')

				clearInterval(timer)
			} else {
				setPercent(100 + Number((((now - recycle_time) * 100) / duration).toFixed(0)))
			}
		}, 3000)

		return () => clearInterval(timer)
	}, [cycle, recycle_time])

	return (
		<Progress
			className={$cx(!useByArchive && 'absolute top_0 left_0', styles._local)}
			type='circle'
			trailColor='transparent'
			strokeColor='var(--color_text)'
			success={{ strokeColor: 'var(--color_text)' }}
			showInfo={false}
			size={14}
			strokeWidth={6}
			percent={percent}
		></Progress>
	)
}

export default $app.memo(Index)
