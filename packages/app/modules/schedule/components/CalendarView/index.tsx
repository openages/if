import ContextMenu from './ContextMenu'
import Day from './Day'
import styles from './index.css'

import type { IPropsCalendarView } from '../../types'

const Index = (props: IPropsCalendarView) => {
	const {
		container,
		view,
		scale,
		calendar_days,
		timeblock_copied,
		tags,
		today_index,
		move_item,
		addTimeBlock,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props

	return (
		<div className={$cx('w_100 h_100 flex', scale === 'day' && styles.day_scale)}>
			{calendar_days.map((day, index) => (
				<Day
					container={container}
					day={day}
					counts={calendar_days.length}
					index={index}
					tags={tags}
					today={index === today_index}
					move_item={move_item?.day_index === index && move_item}
					updateTimeBlock={updateTimeBlock}
					removeTimeBlock={removeTimeBlock}
					copyTimeBlock={copyTimeBlock}
					changeTimeBlockLength={changeTimeBlockLength}
					key={index}
				></Day>
			))}
			<ContextMenu
				view={view}
				timeblock_copied={timeblock_copied}
				addTimeBlock={addTimeBlock}
			></ContextMenu>
		</div>
	)
}

export default $app.memo(Index)
