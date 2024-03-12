import styles from './index.css'

import type { IPropsTimelineViewDay } from '../../types'

const Index = (props: IPropsTimelineViewDay) => {
	const { index, counts } = props

	return (
		<div
			className={$cx('h_100', styles.Day)}
			style={{
				width: `calc(100% / ${counts})`,
				left: `calc(((100% / ${counts}) * ${index}))`
			}}
		></div>
	)
}

export default $app.memo(Index)
