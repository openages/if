import { useMemoizedFn } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'

import { SortableWrap } from '@/components'
import { useMounted } from '@/hooks'
import { Todo } from '@/types'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { DragEndEvent } from '@dnd-kit/core'
import type { IPropsChildren } from '../../types'

const Index = (props: IPropsChildren) => {
	const {
		items,
		index,
		open,
		handled,
		useByDetail,
		dimension_id,
		ChildrenContextMenu,
		update: updateChildren,
		tab,
		insertChildren,
		removeChildren
	} = props
	const mounted = useMounted(300)

	const update = useMemoizedFn(
		async (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => {
			const children = items.slice()

			children[children_index] = { ...children[children_index], ...value }

			await updateChildren({ type: 'children', index, dimension_id, value: children })
		}
	)

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return

		const children = arrayMove(items, active.data.current.index, over.data.current.index)

		updateChildren({ type: 'children', dimension_id, index, value: children })
	})

	if (!items || !items.length) return null

	return (
		<AnimatePresence initial={false}>
			{open && (
				<motion.div
					className={$cx(
						'w_100 border_box',
						styles._local,
						handled && styles.handled,
						useByDetail && styles.useByDetail
					)}
					initial={mounted ? { opacity: 0, height: 0 } : false}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.18 }}
					layout
				>
					<div className='children_wrap w_100 border_box flex flex_column'>
						<DndContext onDragEnd={onDragEnd}>
							<SortableContext items={items} strategy={verticalListSortingStrategy}>
								{items.map((item, children_index) => (
									<SortableWrap
										id={item.id}
										data={{ index: children_index }}
										key={item.id}
									>
										<Item
											{...{
												item,
												index,
												children_index,
												useByDetail,
												ChildrenContextMenu,
												dimension_id,
												update,
												tab,
												insertChildren,
												removeChildren
											}}
										></Item>
									</SortableWrap>
								))}
							</SortableContext>
						</DndContext>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default $app.memo(Index)
