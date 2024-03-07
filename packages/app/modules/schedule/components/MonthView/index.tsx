import Day from './Day'

import type { IPropsMonthView } from '../../types'

const Index = (props: IPropsMonthView) => {
	const { view, days, calendar_days, tags, updateTimeBlock, removeTimeBlock, copyTimeBlock, jump } = props

	return (
		<div className={$cx('w_100 h_100 flex flex_wrap')}>
			{calendar_days.map((day, index) => (
				<Day
					day_info={days[index]}
					day={day}
					index={index}
					tags={tags}
					updateTimeBlock={updateTimeBlock}
					removeTimeBlock={removeTimeBlock}
					copyTimeBlock={copyTimeBlock}
					jump={jump}
					key={index}
				></Day>
			))}
		</div>
	)
}

export default $app.memo(Index)
