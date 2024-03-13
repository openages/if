import { useSize } from 'ahooks'
import { useMemo } from 'react'

import Day from './Day'
import styles from './index.css'
import Row from './Row'

import type { IPropsTimelineView } from '../../types'

const Index = (props: IPropsTimelineView) => {
	const {
		container,
		view,
		days,
		setting_timeline_angles,
		timeline_angles,
		tags,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock
	} = props
	const size = useSize(container)

	const step = useMemo(() => {
		if (!size?.width || !days.length) return 0

		return parseFloat(((size.width - 90) / days.length / 2).toFixed(3))
	}, [days, size])

	return (
		<div className='h_100 relative'>
			<div className={$cx('w_100 h_100 absolute top_0 left_0', styles.timeline_wrap)}>
				<div className='w_100 flex flex_column'>
					{setting_timeline_angles.map((angle, angle_index) => (
						<div className='timeline_angle w_100 border_box flex relative' key={angle.id}>
							<div className='angle_header h_100 border_box flex justify_center align_center absolute top_0 left_0'>
								{angle.text}
							</div>
							<div className='angle_rows w_100 border_box flex flex_column relative'>
								{days.map((_, index) => (
									<Day index={index} counts={days.length} key={index}></Day>
								))}
								{angle.rows.map((row_id, row_index) => (
									<Row
										container={container}
										step={step}
										days_length={days.length}
										angle_index={angle_index}
										row_index={row_index}
										angle_id={angle.id}
										row_id={row_id}
										timeblocks={timeline_angles?.[row_id] || []}
										key={row_id}
									></Row>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
