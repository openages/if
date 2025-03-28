import { useMemo } from 'react'

import { useSize } from '@/hooks'

import Scanline from '../Scanline'
import styles from './index.css'
import Row from './Row'

import type { IPropsTimelineView } from '../../types'

const Index = (props: IPropsTimelineView) => {
	const {
		unpaid,
		container,
		days,
		setting_timeline_angles,
		timeline_rows,
		tags,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props
	const width = useSize(() => container.current!, 'width') as number

	const step = useMemo(() => {
		if (!width || !days.length) return 0

		return parseFloat(((width - 90) / days.length).toFixed(3))
	}, [days, width])

	return (
		<div className='h_100 relative'>
			<Scanline timeline step={step} start_day={days[0].value.format('YYYY-MM-DD')}></Scanline>
			<div className={$cx('w_100 h_100 absolute top_0 left_0', styles.timeline_wrap)}>
				<div className='w_100 flex flex_column'>
					{setting_timeline_angles.map((angle, angle_index) => (
						<div
							className={$cx(
								'timeline_angle w_100 border_box flex relative',
								move_item?.angle_index === angle_index && 'move_over'
							)}
							key={angle.id}
						>
							<div className='angle_header h_100 border_box flex absolute top_0 left_0'>
								{angle.text}
							</div>
							<div className='angle_rows w_100 border_box flex flex_column relative'>
								<div className='row_day_items w_100 h_100 flex absolute left_0 top_0'>
									{Array.from({ length: days.length }).map((_, index) => (
										<div
											className={$cx(
												'row_day_item border_box',
												[0, 6].includes(days[index].value.day()) &&
													'relax_day'
											)}
											key={index}
										></div>
									))}
								</div>
								{angle.rows.map((row_id, row_index) => (
									<Row
										unpaid={unpaid}
										container={container}
										tags={tags}
										step={step}
										days_length={days.length}
										angle_index={angle_index}
										row_index={row_index}
										angle_id={angle.id}
										row_id={row_id}
										timeblocks={timeline_rows?.[row_id] || []}
										move_item={
											move_item?.angle_index === angle_index &&
											move_item.row_index === row_index
												? move_item
												: undefined
										}
										updateTimeBlock={updateTimeBlock}
										removeTimeBlock={removeTimeBlock}
										copyTimeBlock={copyTimeBlock}
										changeTimeBlockLength={changeTimeBlockLength}
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
