import { useMemoizedFn } from 'ahooks'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'

import { SimpleEmpty, SortableWrap } from '@/components'
import { getSerialNumber } from '@/utils'
import { useDroppable } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import FlatAngleHeader from '../FlatAngleHeader'
import FlatTodoItem from '../FlatTodoItem'
import GroupTitle from '../GroupTitle'
import styles from './index.css'

import type { IPropsFlatTodos } from '../../types'
import type { Todo } from '@/types'

const Index = (props: IPropsFlatTodos) => {
	const {
		mode,
		items,
		angles: _angles,
		tags,
		zen_mode,
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
	const container = useRef<HTMLDivElement | null>(null)
	const visible = useInView(container, { root: scroll_container })
	const [fold, setFold] = useState(false)

	const { isOver, active, setNodeRef } = useDroppable({
		id: `kanban_${dimension_id}`,
		data: { index: -1, dimension_id },
		disabled: items.length > 0
	})

	const angles = useMemo(() => _angles.filter(item => item.id !== dimension_id), [_angles, dimension_id])

	const percent = useMemo(
		() => (items.filter(item => (item as Todo.Todo).status !== 'unchecked').length * 100) / items.length,
		[items]
	)

	const toggleFold = useMemoizedFn(() => setFold(!fold))

	return (
		<div
			className={$cx(
				'w_100 border_box flex flex_column relative',
				styles._local,
				!items.length && isOver && active?.data?.current?.dimension_id !== dimension_id && styles.isOver
			)}
			ref={ref => {
				setNodeRef(ref)
				container.current = ref
			}}
		>
			<FlatAngleHeader
				angle={angle}
				dimension_id={dimension_id!}
				counts={items.length}
				percent={percent}
				sticky={visible}
				fold={fold}
				insert={insert}
				toggleFold={toggleFold}
			></FlatAngleHeader>
			<AnimatePresence initial={false}>
				<If condition={!fold}>
					<motion.div
						className='todo_items_wrap w_100 flex flex_column'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						{items.length ? (
							<SortableContext items={items} strategy={verticalListSortingStrategy}>
								{items.map((item, index) =>
									item.type === 'todo' ? (
										<SortableWrap
											id={item.id}
											data={{ index, dimension_id }}
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
											<GroupTitle
												{...{ item, index, update, remove }}
											></GroupTitle>
										</SortableWrap>
									)
								)}
							</SortableContext>
						) : (
							<SimpleEmpty className='empty' />
						)}
					</motion.div>
				</If>
			</AnimatePresence>
		</div>
	)
}

export default $app.memo(Index)
