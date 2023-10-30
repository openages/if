import { useMemoizedFn } from 'ahooks'
import { AnimatePresence, motion } from 'framer-motion'

import { Todo } from '@/types'

import styles from './index.css'
import Item from './Item'

import type { IPropsChildren } from '../../types'

const Index = (props: IPropsChildren) => {
	const {
		items,
		index,
		fold,
		isDragging,
		handled,
		ChildrenContextMenu,
		update: updateChildren,
		tab,
		insertChildren,
		removeChildren
	} = props

	const update = useMemoizedFn(
		async (children_index: number, value: Partial<Omit<Todo.Todo['children'][number], 'id'>>) => {
			const children = [...items]

			children[children_index] = { ...children[children_index], ...value }

			await updateChildren({ type: 'children', index, value: children })
		}
	)

	if (!items || !items.length) return null

	return (
		<AnimatePresence mode={isDragging ? 'popLayout' : 'sync'}>
			{!fold && (
				<motion.div
					className={$cx('w_100 border_box', styles._local, handled && styles.handled)}
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.18 }}
				>
					<div className='children_wrap w_100 border_box flex flex_column'>
						{items.map((item, children_index) => (
							<Item
								{...{
									item,
									index,
									children_index,
									ChildrenContextMenu,
									update,
									tab,
									insertChildren,
									removeChildren
								}}
								key={item.id}
							></Item>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default $app.memo(Index)
