import { useSize } from 'ahooks'
import { useMemo } from 'react'

import Scanline from '../Scanline'
import styles from './index.css'
import Row from './Row'

import type { IPropsTimelineView } from '../../types'

const Index = (props: IPropsTimelineView) => {
	const {
		container,
		scale,
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
	const size = useSize(container)

	const limit = useMemo(() => (scale === 'year' ? 1 : 2), [scale])

	const step = useMemo(() => {
		if (!size?.width || !days.length) return 0

		return parseFloat(((size.width - 90) / days.length / limit).toFixed(3))
	}, [days, size, limit])

	return (
		<div className='h_100 relative'>
			<Scanline timeline scale={scale} step={step}></Scanline>
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
							<div className='angle_header h_100 border_box flex justify_center align_center absolute top_0 left_0'>
								{angle.text}
							</div>
							<div className='angle_rows w_100 border_box flex flex_column relative'>
								{angle.rows.map((row_id, row_index) => (
									<Row
										container={container}
										scale={scale}
										tags={tags}
										step={step}
										limit={limit}
										days_length={days.length}
										angle_index={angle_index}
										row_index={row_index}
										angle_id={angle.id}
										row_id={row_id}
										timeblocks={timeline_rows?.[row_id] || []}
										move_item={
											move_item?.angle_index === angle_index &&
											move_item.row_index === row_index &&
											move_item
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
