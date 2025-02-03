import { useDeepCompareEffect, useMemoizedFn } from 'ahooks'
import { useMemo, useRef, useState } from 'react'
import { Layer, Line, Stage } from 'react-konva'

import { SortableWrap } from '@/components'
import { useCssVariable, useSize } from '@/hooks'
import { getSerialNumber, points } from '@/utils'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import GroupTitle from '../GroupTitle'
import KanbanTodoItem from '../KanbanTodoItem'
import TodoItem from '../TodoItem'
import styles from './index.css'
import { getLinkedItems, getRelativePostion } from './utils'

import type { DragStartEvent } from '@dnd-kit/core'
import type { IPropsTodos } from '../../types'

const Index = (props: IPropsTodos) => {
	const {
		mode,
		items,
		angles: _angles,
		tags,
		relations,
		drag_disabled,
		zen_mode,
		open_items,
		dimension_id,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props
	const container = useRef<HTMLDivElement>(null)
	const stoper = useRef<number>()
	const [lines, setLines] = useState<Array<JSX.Element>>([])
	const [link_points, setLinkPoints] = useState<Array<number> | null>(null)
	const size = useSize(() => container.current!, 'height') as number
	const height = useMemo(() => (size ? size : 0), [size])
	const color_text_line = useCssVariable('--color_text_line')
	const color_text_softlight = useCssVariable('--color_text_softlight')

	const { isOver, active, setNodeRef } = useDroppable({
		id: `kanban_${dimension_id}`,
		data: { index: -1, dimension_id },
		disabled: items.length > 0
	})

	useDndMonitor({
		onDragStart: useMemoizedFn(({ active }: DragStartEvent) => {
			const exsit_index = relations?.findIndex(item => item.items.includes(active.id as string))

			if (exsit_index === -1) return

			stoper.current = requestAnimationFrame(frameRenderLines)
		}),
		onDragEnd: useMemoizedFn(() => {
			if (stoper.current) {
				cancelAnimationFrame(stoper.current)
			}
		})
	})

	const relations_lines = useMemo(() => {
		const target: Array<{ point: [string, string]; checked: boolean }> = []

		relations!.map(item => {
			let links = item.items
			const lines = getLinkedItems(links)

			lines.map(point => {
				target.push({ point, checked: item.checked })
			})
		})

		return target
	}, [items, relations])

	const getPoints = useMemoizedFn((ids: [string, string]) => {
		const active = document.getElementById(ids[0]) as HTMLDivElement
		const over = document.getElementById(ids[1]) as HTMLDivElement

		if (!active || !over) return

		const y_1 = getRelativePostion(container.current!, active) + 7
		const y_2 = getRelativePostion(container.current!, over) + 7
		const [up, down] = y_1 < y_2 ? [y_1, y_2] : [y_2, y_1]

		return points([8, up], [1, up], [1, down], [8, down])
	})

	const makeLinkLine = useMemoizedFn((args: { active_id: string; y: number } | null) => {
		if (!args) return setLinkPoints(null)

		const { active_id, y } = args

		const y_1 = getRelativePostion(container.current!, document.getElementById(active_id) as HTMLDivElement) + 7
		const y_2 = y - container.current!.getBoundingClientRect().y
		const [up, down] = y_1 < y_2 ? [y_1, y_2] : [y_2, y_1]

		setLinkPoints(points([8, up], [1, up], [1, down], [8, down]))
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

	const renderLines = useMemoizedFn(() => {
		stoper.current = requestAnimationFrame(frameRenderLines)

		setTimeout(() => cancelAnimationFrame(stoper.current!), 180)
	})

	useDeepCompareEffect(() => {
		const timer = setTimeout(() => markLines(), 120)

		return () => clearTimeout(timer)
	}, [color_text_line, color_text_softlight, relations_lines, items])

	const angles = useMemo(() => _angles.filter(item => item.id !== dimension_id), [_angles, dimension_id])

	return (
		<div
			className={$cx(
				'limited_content_wrap relative',
				styles._local,
				mode === 'kanban' && styles.kanban,
				mode === 'quad' && styles.quad,
				!items.length && isOver && active?.data?.current?.dimension_id !== dimension_id && styles.isOver
			)}
			ref={ref => mode === 'kanban' && setNodeRef(ref)}
		>
			{height > 0 && !drag_disabled && mode === 'list' && (
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
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					{items.map((item, index) =>
						item.type === 'todo' ? (
							<SortableWrap id={item.id} data={{ index, dimension_id }} key={item.id}>
								{mode === 'kanban' ? (
									<KanbanTodoItem
										{...{
											mode,
											item,
											index,
											tags,
											angles,
											zen_mode,
											dimension_id,
											check,
											insert,
											update,
											tab,
											moveTo,
											remove,
											handleOpenItem,
											showDetailModal
										}}
										serial={getSerialNumber(dimension_id!)}
									></KanbanTodoItem>
								) : (
									<TodoItem
										{...{
											mode,
											item,
											index,
											tags,
											angles,
											drag_disabled,
											zen_mode,
											open_items,
											dimension_id,
											makeLinkLine,
											renderLines,
											check,
											updateRelations,
											insert,
											update,
											tab,
											moveTo,
											remove,
											handleOpenItem,
											showDetailModal
										}}
									></TodoItem>
								)}
							</SortableWrap>
						) : (
							<SortableWrap id={item.id} data={{ index }} key={item.id}>
								<GroupTitle {...{ item, index, update, remove }}></GroupTitle>
							</SortableWrap>
						)
					)}
				</SortableContext>
			</div>
		</div>
	)
}

export default $app.memo(Index)
