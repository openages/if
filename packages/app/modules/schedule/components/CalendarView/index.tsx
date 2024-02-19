import ContextMenu from './ContextMenu'
import Day from './Day'
import styles from './index.css'

import type { IPropsCalendarView } from '../../types'

const Index = (props: IPropsCalendarView) => {
	const { container, scale, days, addTimeBlock } = props

	return (
		<div className={$cx('w_100 flex', styles._local, scale === 'week' && styles.week)}>
			{days.map((day, index) => (
				<Day day={day} counts={days.length} index={index} key={index}></Day>
			))}
			<ContextMenu container={container} addTimeBlock={addTimeBlock}></ContextMenu>
		</div>
	)
}

export default $app.memo(Index)
