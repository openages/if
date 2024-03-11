import { useSize } from 'ahooks'
import { useMemo } from 'react'

import Day from './Day'
import styles from './index.css'

import type { IPropsTimelineView } from '../../types'

const Index = (props: IPropsTimelineView) => {
	const { container, view, days, calendar_days, tags, updateTimeBlock, removeTimeBlock, copyTimeBlock } = props
	const size = useSize(container)

	const day_width = useMemo(() => {
		if (!size?.width || !days.length) return 0

		return parseFloat((size.width / days.length).toFixed(3))
	}, [days, size])

	return (
		<div className='h_100 relative'>
			{days.map((item, index) => (
				<Day day_info={item} index={index} counts={days.length} key={index}></Day>
			))}
			<div className={$cx('w_100 h_100 absolute top_0 left_0', styles.timeline_wrap)}>
				<div className='w_100 flex flex_column'>
					<div className='circle'></div>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
