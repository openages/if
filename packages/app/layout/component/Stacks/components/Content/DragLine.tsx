import { useRef } from 'react'

import { useDragWidth } from '@/hooks'

import styles from './index.css'

import type { IPropsStacksDragLine } from '../../../../types'

const Index = (props: IPropsStacksDragLine) => {
	const { getWidth, setWidth } = props
	const ref = useRef<HTMLDivElement>(null)

	const draging = useDragWidth(ref, getWidth, setWidth, true)

	return (
		<div
			className={$cx(
				'drag_line flex justify_center align_center absolute top_0 h_100 z_index_100 transition_normal',
				styles.drag_line,
				draging && styles.draging
			)}
			ref={ref}
		></div>
	)
}

export default $app.memo(Index)
