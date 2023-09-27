import { useSize, useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import { useRef, useMemo, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'

import { useCssVariable } from '@/hooks'
import { points } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import GroupTitle from '../GroupTitle'
import TodoItem from '../TodoItem'
import styles from './index.css'
import { getRelativePostion, getLinkedItems } from './utils'

import type { IPropsTodos } from '../../types'
import type { DragEndEvent } from '@dnd-kit/core'

const Index = (props: IPropsTodos) => {
	const { items, relations, drag_disabled, check, updateRelations, move } = props
	const container = useRef<HTMLDivElement>(null)
	const [lines, setLines] = useState<Array<JSX.Element>>([])
	const [link_points, setLinkPoints] = useState<Array<number>>(null)
	const size = useSize(container)
	const height = useMemo(() => (size ? size.height : 0), [size])
	const color_text_rgb = useCssVariable('--color_text_rgb')
	const color_text_softlight = useCssVariable('--color_text_softlight')

	const relations_lines = useMemo(() => {
		const target: Array<{ point: [string, string]; checked: boolean }> = []

		relations.map((item) => {
			const lines = getLinkedItems(item.items)

			lines.map((point) => {
				target.push({ point, checked: item.checked })
			})
		})

		return target
	}, [relations])

	const getPoints = useMemoizedFn((ids: [string, string]) => {
		const active = document.getElementById(ids[0]) as HTMLDivElement
		const over = document.getElementById(ids[1]) as HTMLDivElement

		if (!active || !over) return

		const y_1 = getRelativePostion(container.current, active) + 7
		const y_2 = getRelativePostion(container.current, over) + 7
		const [up, down] = y_1 < y_2 ? [y_1, y_2] : [y_2, y_1]

		return points([8, up], [1, up], [1, down], [8, down])
	})

	const makeLinkLine = useMemoizedFn((args: { active_id: string; y: number } | null) => {
		if (!args) return setLinkPoints(null)

		const { active_id, y } = args

		const y_1 = getRelativePostion(container.current, document.getElementById(active_id) as HTMLDivElement) + 7
		const y_2 = y - container.current.getBoundingClientRect().y
		const [up, down] = y_1 < y_2 ? [y_1, y_2] : [y_2, y_1]

		setLinkPoints(points([8, up], [1, up], [1, down], [8, down]))
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return

		move({ active_index: active.data.current.index, over_index: over.data.current.index })
	})

	useDeepCompareEffect(() => {
		const timer = setTimeout(() => {
			setLines(
				relations_lines.map((item, index) => (
					<Line
						points={getPoints(item.point)}
						stroke={item.checked ? color_text_softlight : `rgba(${color_text_rgb},0.72})`}
						strokeWidth={1}
						tension={0}
						key={index}
					></Line>
				))
			)
		}, 120)

		return () => clearTimeout(timer)
	}, [color_text_rgb, relations_lines, items])

	return (
		<div className={$cx('limited_content_wrap relative', styles._local)}>
			{height > 0 && !drag_disabled && (
				<Stage className='stage_wrap absolute' width={9} height={height}>
					<Layer>
						{lines}
						{link_points && (
							<Line
								points={link_points}
								stroke={`rgba(${color_text_rgb},0.72)`}
								strokeWidth={1}
								tension={0}
							></Line>
						)}
					</Layer>
				</Stage>
			)}
			<div className='todo_items_wrap w_100 flex flex_column' ref={container}>
				<DndContext onDragEnd={onDragEnd}>
					<SortableContext items={items}>
						{items.map((item, index) =>
							item.type === 'todo' ? (
								<TodoItem
									{...{
										item,
										index,
										drag_disabled,
										makeLinkLine,
										check,
										updateRelations
									}}
									key={item.id}
								></TodoItem>
							) : (
								<GroupTitle {...{ item, index }} key={item.id}></GroupTitle>
							)
						)}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	)
}

export default $app.memo(Index)
