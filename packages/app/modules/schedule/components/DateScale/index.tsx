import { useMemo } from 'react'

import { getStaticWeekdays } from '@/modules/schedule/utils'
import { ArrowLineDown } from '@phosphor-icons/react'

import DayExtra from '../DayExtra'
import styles from './index.css'

import type { IPropsDateScale } from '../../types'

const Index = (props: IPropsDateScale) => {
	const { view, scale, days, show_time_scale, scrollToScanline } = props

	const not_fixed = useMemo(() => view !== 'fixed', [view])
	const timeline = useMemo(() => view === 'timeline', [view])
	const target_weekdays = useMemo(() => (scale === 'month' ? getStaticWeekdays() : days), [scale, days])

	return (
		<div
			className={$cx(
				'w_100 border_box flex',
				styles._local,
				!show_time_scale && styles.hidden_time_scale,
				scale === 'day' && styles.day_scale
			)}
		>
			{show_time_scale && (
				<div className='btn_now_wrap h_100 border_box flex justify_center align_center'>
					<div
						className='btn_std flex justify_center align_center clickable'
						onClick={scrollToScanline}
					>
						<ArrowLineDown></ArrowLineDown>
					</div>
				</div>
			)}
			<div className='weekday_items flex'>
				{target_weekdays.map((item, index) => (
					<div
						className={$cx(
							'weekday_item border_box flex justify_between align_center',
							item.is_today && 'today',
							!show_time_scale && !timeline && 'hidden_time_scale',
							!not_fixed && 'fixed_view'
						)}
						style={{ width: `calc(100% / ${show_time_scale || timeline ? days.length : 7})` }}
						key={index}
					>
						<div className='flex align_center'>
							<span className='weekday'>{item.weekday}</span>
							{not_fixed && (show_time_scale || timeline) && (
								<span className='date ml_6'>{item.date}</span>
							)}
						</div>
						{not_fixed && (show_time_scale || timeline) && <DayExtra item={item}></DayExtra>}
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
