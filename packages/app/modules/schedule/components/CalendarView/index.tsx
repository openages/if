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
		addTimeBlock,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		updateTodoSchedule,
		changeTimeBlockLength
	} = props

	return (
		<div className={$cx('w_100 flex', styles._local, scale === 'week' && styles.week)}>
			{calendar_days.map((day, index) => (
				<Day
					container={container}
					day={day}
					counts={calendar_days.length}
					index={index}
					tags={tags}
					updateTimeBlock={updateTimeBlock}
					removeTimeBlock={removeTimeBlock}
					copyTimeBlock={copyTimeBlock}
					updateTodoSchedule={updateTodoSchedule}
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
