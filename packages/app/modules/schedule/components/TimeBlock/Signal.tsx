import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsCalendarViewTimeBlockSignal } from '../../types'
import type { CSSProperties } from 'react'

const Index = (props: IPropsCalendarViewTimeBlockSignal) => {
	const { item, step = 16, timeline } = props

	const style = useMemo(() => {
		const target = {} as CSSProperties

		if (!timeline) {
			target['left'] = 1
			target['width'] = `calc(100% - 2px)`
			target['height'] = item.length * step

			return target
		}

		target['top'] = 1
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
