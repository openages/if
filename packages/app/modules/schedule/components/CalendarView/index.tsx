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
		addTimeBlock,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock
	} = props

	return (
		<div className={$cx('w_100 flex', styles._local, scale === 'week' && styles.week)}>
			{calendar_days.map((day, index) => (
				<Day
					container={container}
					day={day}
					counts={calendar_days.length}
					index={index}
					updateTimeBlock={updateTimeBlock}
					removeTimeBlock={removeTimeBlock}
					copyTimeBlock={copyTimeBlock}
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
