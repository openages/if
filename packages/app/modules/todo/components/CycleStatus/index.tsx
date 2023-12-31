import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { HourglassMedium } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCircleStatus } from '../../types'

const Index = (props: IPropsCircleStatus) => {
	const { cycle, recycle_time } = props
	const [percent, setPercent] = useState(0)
	const { t } = useTranslation()
	const scale_text = cycle?.scale ? t(`translation:todo.Input.Cycle.options.${cycle.scale}`) : ''

	useEffect(() => {
		if (!recycle_time) return setPercent(0)

		const duration =
			(cycle.scale === 'quarter'
				? dayjs.duration(cycle.interval, 'month').asSeconds() * 3
				: dayjs.duration(cycle.interval, cycle.scale).asSeconds()) * 1000

		const interval = match(cycle.scale)
			.with('minute', () => 1000)
			.with('hour', () => 60 * 1000)
			.otherwise(() => 180 * 1000)

		const timer = setInterval(() => {
			const now = new Date().valueOf()

			if (now >= recycle_time) {
				setPercent(100)

				clearInterval(timer)

				window.$app.Event.emit('todo/cycleByTime')
			} else {
				setPercent(100 + Number((((now - recycle_time) * 100) / duration).toFixed(0)))
			}
		}, interval)

		return () => clearInterval(timer)
	}, [cycle, recycle_time])

	return (
		<div className={$cx('other_wrap border_box flex align_center relative', styles._local)}>
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
				<HourglassMedium className='icon' size={10} weight='fill'></HourglassMedium>
				<span className='text ml_2'>
					{`${t('translation:todo.Input.Cycle.every')} ${cycle?.interval} ${scale_text}`}
					{cycle?.exclude?.length > 0 &&
						`, ${t('translation:todo.Input.Cycle.exclude')} ${scale_text} ${cycle.exclude.join(
							','
						)}`}
				</span>
			</div>
		</div>
	)
}

export default $app.memo(Index)
