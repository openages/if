import { useMemoizedFn } from 'ahooks'
import { useInView } from 'framer-motion'
import { useMemo, useRef } from 'react'

import { SimpleEmpty, SortableWrap } from '@/components'
import { getSerialNumber } from '@/utils'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import FlatAngleHeader from '../FlatAngleHeader'
import FlatTodoItem from '../FlatTodoItem'
import GroupTitle from '../GroupTitle'
import styles from './index.css'

import type { DragStartEvent } from '@dnd-kit/core'
import type { IPropsFlatTodos } from '../../types'
import type { Todo } from '@/types'

const Index = (props: IPropsFlatTodos) => {
	const {
		mode,
		items,
		angles: _angles,
		tags,
		relations,
		zen_mode,
		kanban_mode,
		dimension_id,
		angle,
		scroll_container,
		check,
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
	const visible = useInView(container, { root: scroll_container })

	const { isOver, active, setNodeRef } = useDroppable({
		id: `kanban_${dimension_id}`,
		data: { index: -1, dimension_id },
		disabled: items.length > 0
	})

	useDndMonitor({
		onDragStart: useMemoizedFn(({ active }: DragStartEvent) => {
			const exsit_index = relations?.findIndex(item => item.items.includes(active.id as string))

			if (exsit_index === -1) return
		}),
		onDragEnd: useMemoizedFn(() => {
			if (stoper.current) {
				cancelAnimationFrame(stoper.current)
			}
		})
	})

	const angles = useMemo(() => _angles.filter(item => item.id !== dimension_id), [_angles, dimension_id])

	const percent = useMemo(
		() => (items.filter(item => (item as Todo.Todo).status !== 'unchecked').length * 100) / items.length,
		[items]
	)

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column relative',
				styles._local,
				!items.length && isOver && active?.data?.current?.dimension_id !== dimension_id && styles.isOver
			)}
			ref={ref => setNodeRef(ref)}
		>
			<FlatAngleHeader
				angle={angle}
				dimension_id={dimension_id!}
				counts={items.length}
				percent={percent}
				sticky={visible}
				insert={insert}
			></FlatAngleHeader>
			<div className='todo_items_wrap w_100 flex flex_column' ref={container}>
				{items.length ? (
					<SortableContext items={items} strategy={verticalListSortingStrategy}>
						{items.map((item, index) =>
							item.type === 'todo' ? (
								<SortableWrap
									id={item.id}
									data={{ index, dimension_id }}
									disabled={kanban_mode === 'tag'}
									key={item.id}
								>
									<FlatTodoItem
										{...{
											mode,
											item,
											index,
											tags,
											angles,
											zen_mode,
											kanban_mode,
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
										serial={getSerialNumber(angle.id)}
									></FlatTodoItem>
								</SortableWrap>
							) : (
								<SortableWrap id={item.id} data={{ index }} key={item.id}>
									<GroupTitle {...{ item, index, update, remove }}></GroupTitle>
								</SortableWrap>
							)
						)}
					</SortableContext>
				) : (
					<SimpleEmpty className='empty' />
				)}
			</div>
		</div>
	)
}

export default $app.memo(Index)
