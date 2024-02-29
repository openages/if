import ContextMenu from './ContextMenu'
import Day from './Day'

import type { IPropsCalendarView } from '../../types'

const Index = (props: IPropsCalendarView) => {
	const {
		container,
		view,
		calendar_days,
		timeblock_copied,
		tags,
		today_index,
		addTimeBlock,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		updateTodoSchedule,
		changeTimeBlockLength
	} = props

	return (
		<div className={$cx('w_100 flex')}>
			{calendar_days.map((day, index) => (
				<Day
					container={container}
					day={day}
					counts={calendar_days.length}
					index={index}
					tags={tags}
					today={index === today_index}
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
