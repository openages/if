import { useSize, useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import { useRef, useMemo, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'

import { points } from '@/utils'

import TodoItem from '../TodoItem'
import styles from './index.css'
import { getRelativePostion } from './utils'

import type { IPropsTodos } from '../../types'
import type { Todo } from '@/types'


const Index = (props: IPropsTodos) => {
	const { items, addIfIds } = props
	const container = useRef<HTMLDivElement>(null)
	const [lines, setLines] = useState<Array<JSX.Element>>([])
	const [link_points, setLinkPoints] = useState<Array<number>>(null)
	const size = useSize(container)
	const height = useMemo(() => (size ? size.height : 0), [size])
	const stroke = useMemo(
		() => `rgba(${getComputedStyle(document.body).getPropertyValue('--color_text_rgb')},0.72)`,
		[]
	)

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
	}, [items])

	const getPoints = useMemoizedFn((ids: [string, string]) => {
		const y_1 = getRelativePostion(container.current, document.getElementById(ids[0]) as HTMLDivElement) + 7
		const y_2 = getRelativePostion(container.current, document.getElementById(ids[1]) as HTMLDivElement) + 7
		const [up, down] = y_1 < y_2 ? [y_1, y_2] : [y_2, y_1]

		return points([15, up], [1, up + (down - up) / 2], [15, down])
	})

	const makeLinkLine = useMemoizedFn((args: { active_id: string; y: number } | null) => {
		if (!args) return setLinkPoints(null)

		const { active_id, y } = args

		const y_1 = getRelativePostion(container.current, document.getElementById(active_id) as HTMLDivElement) + 7
		const y_2 = y - container.current.getBoundingClientRect().y
		const [up, down] = y_1 < y_2 ? [y_1, y_2] : [y_2, y_1]

		setLinkPoints(points([15, up], [1, up + (down - up) / 2], [15, down]))
	})

	useDeepCompareEffect(() => {
		if (!all_if_ids.length) return

		setLines(
			all_if_ids.map((item, index) => (
				<Line
					points={getPoints(item)}
					stroke={stroke}
					strokeWidth={0.6}
					tension={0.12}
					key={index}
				></Line>
			))
		)
	}, [all_if_ids])

	return (
		<div className={$cx('limited_content_wrap relative', styles._local)}>
			{height > 0 && (
				<Stage className='stage_wrap absolute' width={16} height={height}>
					<Layer>
						{lines}
						{link_points && (
							<Line
								points={link_points}
								stroke={stroke}
								strokeWidth={1}
								tension={0.12}
							></Line>
						)}
					</Layer>
				</Stage>
			)}
			<div className='todo_items_wrap w_100 flex flex_column' ref={container}>
				{items.map((item, index) => (
					<TodoItem {...{ item, makeLinkLine, addIfIds }} key={index}></TodoItem>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
