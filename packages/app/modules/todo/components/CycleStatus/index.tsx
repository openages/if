import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getCycleSpecificDesc } from '@/utils/modules/todo'
import { HourglassMedium } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCircleStatus } from '../../types'

const Index = (props: IPropsCircleStatus) => {
	const { cycle, recycle_time } = props
	const [percent, setPercent] = useState(0)
	const { t } = useTranslation()
	const scale_text =
		cycle?.type === 'interval' && cycle?.scale ? t(`translation:todo.Input.Cycle.options.${cycle.scale}`) : ''

	useEffect(() => {
		if (cycle?.type === 'specific') return setPercent(0)
		if (!recycle_time) return setPercent(0)

		const now = new Date().valueOf()

		const duration =
			(cycle.scale === 'quarter'
				? dayjs.duration(cycle.value, 'month').asSeconds() * 3
				: dayjs.duration(cycle.value, cycle.scale).asSeconds()) * 1000

		if (now >= recycle_time) {
			setPercent(100)
		} else {
			setPercent(100 + Number((((now - recycle_time) * 100) / duration).toFixed(0)))
		}
	}, [cycle, recycle_time])

	const desc = useMemo(() => {
		if (cycle.type === 'interval') return `${cycle?.value} ${scale_text}`

		return getCycleSpecificDesc(cycle)
	}, [cycle])

	return (
		<div
			className={$cx(
				'other_wrap border_box flex align_center relative',
				styles._local,
				percent > 0 && styles.percent
			)}
		>
			{percent > 0 && (
				<div
					className={$cx(
						'bg_progress w_100 h_100 border_box absolute top_0 left_0',
						percent < 90 && 'no_right_radius'
					)}
					style={{ width: `${percent}%` }}
				></div>
			)}
			<div className='repeat_content w_100 h_100 flex align_center relative'>
				<HourglassMedium className='icon' size={10}></HourglassMedium>
				<span className='text ml_2'>{desc}</span>
			</div>
		</div>
	)
}

export default $app.memo(Index)
