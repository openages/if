import styles from './index.css'

import type { IPropsCalendarViewTimeBlockSignal } from '../../types'

const Index = ({ item }: IPropsCalendarViewTimeBlockSignal) => {
	return (
		<div
			className={$cx('w_100 border_box absolute top_0 flex flex_column', styles._local, styles.signal)}
			style={{ transform: `translateY(${item.start * 16}px)`, height: item.length * 16 }}
		></div>
	)
}

export default $app.memo(Index)
