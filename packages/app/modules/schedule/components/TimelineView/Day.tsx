import styles from './index.css'

import type { IPropsTimelineViewDay } from '../../types'

const Index = (props: IPropsTimelineViewDay) => {
	const { day_info, index, counts } = props

	return (
		<div
			className={$cx('h_100 border_box absolute top_0', styles.Day, day_info.is_today && styles.today)}
			style={{ width: `calc(100% / ${counts})`, left: `calc((100% / ${counts}) * ${index})` }}
		></div>
	)
}

export default $app.memo(Index)
