import Day from './Day'

import type { IPropsCalendarView } from '../../types'

const Index = (props: IPropsCalendarView) => {
	const {
		container,
		calendar_days,
		tags,
		today_index,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	} = props

	return (
		<div className={$cx('w_100 h_100 flex')}>
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
		</div>
	)
}

export default $app.memo(Index)
