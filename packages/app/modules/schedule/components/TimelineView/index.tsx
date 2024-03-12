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
		calendar_days,
		tags,
		timeline_angles,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock
	} = props
	const size = useSize(container)

	const day_width = useMemo(() => {
		if (!size?.width || !days.length) return 0

		return parseFloat((size.width / days.length).toFixed(3))
	}, [days, size])

	return (
		<div className='h_100 relative'>
			<div className={$cx('h_100 border_box flex absolute top_0', styles.days_wrap)}>
				{days.map((_, index) => (
					<Day index={index} counts={days.length} key={index}></Day>
				))}
			</div>
			<div className={$cx('w_100 h_100 absolute top_0 left_0', styles.timeline_wrap)}>
				<div className='w_100 flex flex_column'>
					{timeline_angles.map(angle => (
						<div className='timeline_angle w_100 border_box flex relative' key={angle.id}>
							<div className='angle_header h_100 border_box flex justify_center align_center absolute top_0 left_0'>
								{angle.text}
							</div>
							<div className='angle_rows w_100 border_box flex flex_column'>
								{angle.rows.map(row_id => (
									<Row key={row_id}></Row>
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
