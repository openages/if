import { useMemoizedFn } from 'ahooks'
import { useRef, useState, Fragment } from 'react'

import { useDragWidth } from '@/hooks'
import { useDndMonitor } from '@dnd-kit/core'

import Drop from './Drop'
import styles from './index.css'
import View from './View'

import type { IPropsStacksContentColumn } from '../../../../types'

const Index = (props: IPropsStacksContentColumn) => {
	const { column_index, column, width, container_width, resizing, click, resize, setResizing } = props
	const [visible_indicator, setVisibleIndicator] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useDndMonitor({
		onDragStart: useMemoizedFn(
			({ active }) => active.data.current.type === 'stack' && setVisibleIndicator(true)
		),
		onDragEnd: useMemoizedFn(({ active }) => active.data.current.type === 'stack' && setVisibleIndicator(false))
	})

	const getWidth = useMemoizedFn(() => width * 0.01 * container_width)
	const setWidth = useMemoizedFn((v: number) => resize(column_index, v))
	const onResizeStart = useMemoizedFn(() => setResizing(true))
	const onResizeEnd = useMemoizedFn(() => setResizing(false))

	useDragWidth({ ref, left: true, getWidth, setWidth, onResizeStart, onResizeEnd })

	return (
		<div
			className={$cx('border_box relative', styles.Column, resizing && styles.resizing)}
			style={{ width: `${column.width}%` }}
		>
			{column_index !== 0 && (
				<div
					className={$cx(
						'drag_line flex justify_center align_center absolute top_0 h_100 z_index_100 transition_normal',
						styles.drag_line,
						true && styles.draging
					)}
					ref={ref}
				></div>
			)}
			{visible_indicator && (
				<Fragment>
					<Drop column_index={column_index} direction='left'></Drop>
					<Drop column_index={column_index} direction='right'></Drop>
				</Fragment>
			)}
			{column.views.map((view, view_index) => (
				<View
					column_index={column_index}
					view_index={view_index}
					view={view}
					width={width}
					container_width={container_width}
					click={click}
					key={view.id}
				></View>
			))}
		</div>
	)
}

export default $app.memo(Index)
