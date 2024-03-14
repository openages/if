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

	const target_weekdays = useMemo(
		() => (view !== 'timeline' && scale === 'month' ? getStaticWeekdays() : days),
		[view, scale, days]
	)

	const timeline_narrow = useMemo(
		() => view === 'timeline' && (scale === 'month' || scale === 'year'),
		[view, scale]
	)

	return (
		<div
			className={$cx(
				'w_100 border_box flex',
				styles._local,
				!show_time_scale && styles.hidden_time_scale,
				scale === 'day' && styles.day_scale,
				view === 'timeline' && styles.timeline
			)}
		>
			{(show_time_scale || view === 'timeline') && (
				<div className='btn_now_wrap h_100 border_box flex justify_center align_center'>
					<div
						className='btn_std flex justify_center align_center clickable'
						onClick={scrollToScanline}
					>
						{view !== 'timeline' && <ArrowLineDown></ArrowLineDown>}
					</div>
				</div>
			)}
			<div className='weekday_items flex'>
				{target_weekdays.map((item, index) => (
					<div
						className={$cx(
							'weekday_item border_box flex align_center',
							item.is_today && 'today',
							!show_time_scale && !timeline && 'hidden_time_scale',
							!not_fixed && 'fixed_view',
							!timeline_narrow ? 'justify_between' : 'justify_center',
							timeline_narrow && 'timeline_narrow'
						)}
						style={{ width: `calc(100% / ${show_time_scale || timeline ? days.length : 7})` }}
						key={index}
					>
						<div className='flex align_center'>
							{!timeline_narrow && <span className='weekday mr_6'>{item.weekday}</span>}
							{not_fixed && (show_time_scale || timeline) && (
								<span className='date'>{item.date}</span>
							)}
						</div>
						{not_fixed && (show_time_scale || timeline) && !timeline_narrow && (
							<DayExtra item={item}></DayExtra>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
