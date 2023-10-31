import { useMemoizedFn } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'

import { useMounted } from '@/hooks'
import { Todo } from '@/types'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsChildren } from '../../types'
import type { DragEndEvent } from '@dnd-kit/core'

const Index = (props: IPropsChildren) => {
	const {
		items: _items,
		index,
		fold,
		isDragging,
		handled,
		useByDetail,
		ChildrenContextMenu,
		update: updateChildren,
		tab,
		insertChildren,
		removeChildren
	} = props
	const [items, setItems] = useState(_items)
	const mounted = useMounted()

	useEffect(() => setItems(_items), [_items])

	const update = useMemoizedFn(
		async (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => {
			const children = [...items]

			children[children_index] = { ...children[children_index], ...value }

			await updateChildren({ type: 'children', index, value: children })
		}
	)

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return

		const value = arrayMove(items, active.data.current.index, over.data.current.index)

		setItems(value)

		updateChildren({ type: 'children', index, value })
	})

	if (!items || !items.length) return null

	return (
		<AnimatePresence mode={isDragging ? 'popLayout' : 'sync'}>
			{!fold && (
				<motion.div
					className={$cx(
						'w_100 border_box',
						styles._local,
						handled && styles.handled,
						useByDetail && styles.useByDetail
					)}
					initial={mounted ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto' }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.18 }}
				>
					<div className='children_wrap w_100 border_box flex flex_column'>
						<DndContext onDragEnd={onDragEnd}>
							<SortableContext items={items} strategy={verticalListSortingStrategy}>
								{items.map((item, children_index) => (
									<Item
										{...{
											item,
											index,
                                                                  children_index,
                                                                  useByDetail,
											ChildrenContextMenu,
											update,
											tab,
											insertChildren,
											removeChildren
										}}
										key={item.id}
									></Item>
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
