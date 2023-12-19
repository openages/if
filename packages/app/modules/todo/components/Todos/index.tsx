import { useDeepCompareEffect, useMemoizedFn, useSize } from 'ahooks'
import { useMemo, useRef, useState } from 'react'
import { Layer, Line, Stage } from 'react-konva'

import { useCssVariable } from '@/hooks'
import { points } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import GroupTitle from '../GroupTitle'
import TodoItem from '../TodoItem'
import styles from './index.css'
import { getLinkedItems, getRelativePostion } from './utils'

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { IPropsTodos } from '../../types'

const Index = (props: IPropsTodos) => {
	const {
		items,
		tags,
		angles,
		relations,
		drag_disabled,
		kanban_mode,
		kanban_index,
		check,
		updateRelations,
		move,
		insert,
		update,
		tab,
		moveTo,
		remove,
		showDetailModal
	} = props
	const container = useRef<HTMLDivElement>(null)
	const stoper = useRef<number>()
	const [lines, setLines] = useState<Array<JSX.Element>>([])
	const [link_points, setLinkPoints] = useState<Array<number>>(null)
	const size = useSize(container)
	const height = useMemo(() => (size ? size.height : 0), [size])
	const color_text_line = useCssVariable('--color_text_line')
	const color_text_softlight = useCssVariable('--color_text_softlight')

	const relations_lines = useMemo(() => {
		const target: Array<{ point: [string, string]; checked: boolean }> = []

		relations.map(item => {
			const lines = getLinkedItems(item.items)

			lines.map(point => {
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

	const onDragStart = useMemoizedFn(({ active }: DragStartEvent) => {
		const exsit_index = relations?.findIndex(item => item.items.includes(active.id as string))

		if (exsit_index === -1) return

		stoper.current = requestAnimationFrame(frameRenderLines)
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return

		move({ active_index: active.data.current.index, over_index: over.data.current.index })

		cancelAnimationFrame(stoper.current)
	})

	const markLines = useMemoizedFn(() => {
		setLines(
			relations_lines.map((item, index) => (
				<Line
					points={getPoints(item.point)}
					stroke={item.checked ? color_text_softlight : color_text_line}
					strokeWidth={1}
					tension={0}
					key={index}
				></Line>
			))
		)
	})

	const frameRenderLines = useMemoizedFn(() => {
		markLines()

		stoper.current = requestAnimationFrame(frameRenderLines)
	})

	const renderLines = useMemoizedFn((id: string) => {
		const exsit_index = relations?.findIndex(item => item.items.includes(id))

		if (exsit_index === -1) return

		stoper.current = requestAnimationFrame(frameRenderLines)

		setTimeout(() => cancelAnimationFrame(stoper.current), 180)
	})

	useDeepCompareEffect(() => {
		const timer = setTimeout(() => markLines(), 120)

		return () => clearTimeout(timer)
	}, [color_text_line, color_text_softlight, relations_lines, items])

	return (
		<div className={$cx('limited_content_wrap relative', styles._local, kanban_mode && styles.kanban_mode)}>
			{height > 0 && !drag_disabled && (
				<Stage className='stage_wrap absolute' width={9} height={height}>
					<Layer>
						{lines}
						{link_points && (
							<Line
								points={link_points}
								stroke={color_text_line}
								strokeWidth={1}
								tension={0}
							></Line>
						)}
					</Layer>
				</Stage>
			)}
			<div className='todo_items_wrap w_100 flex flex_column' ref={container}>
				<DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
					<SortableContext items={items} strategy={verticalListSortingStrategy}>
						{items.map((item, index) =>
							item.type === 'todo' ? (
								<TodoItem
									{...{
										item,
										index,
										tags,
										angles,
										drag_disabled,
										makeLinkLine,
										renderLines,
										check,
										updateRelations,
										insert,
										update,
										tab,
										moveTo,
										remove,
										showDetailModal
									}}
									kanban_mode={kanban_mode}
									kanban_index={kanban_index}
									key={item.id}
								></TodoItem>
							) : (
								<GroupTitle
									{...{ item, index, update, remove }}
									key={item.id}
								></GroupTitle>
							)
						)}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	)
}

export default $app.memo(Index)
