import { useSize, useDeepCompareEffect } from 'ahooks'
import { Line } from 'konva/lib/shapes/Line'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'

import { points } from '@/utils'

import TodoItem from '../TodoItem'
import styles from './index.css'
import { getRelativePostion } from './utils'

import type { IPropsTodos } from '../../types'
import type { Layer as ILayer } from 'konva/lib/Layer'
import type { Todo } from '@/types'

const Index = (props: IPropsTodos) => {
	const { items, addIfIds } = props
	const container = useRef<HTMLDivElement>(null)
	const [layer, setLayer] = useState<ILayer>(null)
	const size = useSize(container)
	const height = useMemo(() => (size ? size.height : 0), [size])
      
	const all_if_ids = useMemo(() => {
		return items.reduce(
			(total, item: Todo.Todo) => {
				item.if_ids?.map((id) => {
					total.push([item.id, id])
				})

				return total
			},
			[] as Array<[string, string]>
		)
      }, [ items ])
      
      console.log(all_if_ids)

	useDeepCompareEffect(() => {
		if (!layer) return

		// const line = new Line({
		// 	points: points(
		// 		[15, link_positions.start],
		// 		[1, link_positions.start + (link_positions.end - link_positions.start) / 2],
		// 		[15, link_positions.end]
		// 	),
		// 	stroke: `rgba(${getComputedStyle(document.body).getPropertyValue('--color_text_rgb')},0.48)`,
		// 	strokeWidth: 0.6,
		// 	tension: 0.12
		// })

		// layer.add(line)
	}, [layer])

	return (
		<div className={$cx('limited_content_wrap relative', styles._local)}>
			{height > 0 && (
				<Stage className='stage_wrap absolute' width={16} height={height}>
					<Layer ref={(v) => setLayer(v)}></Layer>
				</Stage>
			)}
			<div className='todo_items_wrap w_100 flex flex_column' ref={container}>
				{items.map((item, index) => (
					<TodoItem {...{ item, addIfIds }} key={index}></TodoItem>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
