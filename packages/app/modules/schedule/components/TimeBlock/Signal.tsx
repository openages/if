import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsCalendarViewTimeBlockSignal } from '../../types'

const Index = (props: IPropsCalendarViewTimeBlockSignal) => {
	const { item, step = 16, timeline } = props

	const style = useMemo(() => {
		const target = {}

		if (!timeline) {
			target['height'] = item.length * step

			return target
		}

		target['width'] = item.length * step
		target['height'] = 36

		return target
	}, [item, step, timeline])

	return (
		<div
			className={$cx('w_100 border_box absolute top_0 flex flex_column', styles._local, styles.signal)}
			style={{
				transform: `translate${timeline ? 'X' : 'Y'}(${item.start * step}px)`,
				...style
			}}
		></div>
	)
}

export default $app.memo(Index)
