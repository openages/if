import { useMemoizedFn } from 'ahooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Case, Switch } from 'react-if'

import { CheckSquare, Square } from '@phosphor-icons/react'

import ChildrenItem from './ChildrenItem'
import styles from './index.css'

import type { Todo } from '@/types'
import type Model from './model'

interface IProps {
	item: Todo.Todo
	index: number
	updateTodoItem: Model['updateTodoItem']
	check: Model['check']
}

const Index = (props: IProps) => {
	const { item, index, updateTodoItem, check } = props
	const { id, text, status, children } = item
	const [open, setOpen] = useState(false)

	const toggleChildren = useMemoizedFn(() => setOpen(!open))

	const children_status = useMemo(() => {
		if (!(children?.length > 0)) return ''

		const checked_children = children.filter(item => item.status === 'checked')

		return `${checked_children.length}/${children.length}`
	}, [children])

	const onCheck = useMemoizedFn(() => {
		if (status === 'closed') return

		check(index, id, status === 'unchecked' ? 'checked' : 'unchecked')
	})

	const updateChildStatus = useMemoizedFn(
		(child_index: number, status: Todo.Todo['children'][number]['status']) => {
			const target_children = $copy(children)

			target_children[child_index].status = status

			updateTodoItem(index, id, { children: target_children })
		}
	)

	return (
		<div
			className={$cx(
				'w_100 flex flex_column',
				styles.Item,
				(status === 'checked' || status === 'closed') && styles.done
			)}
		>
			<div className='w_100 border_box flex'>
				<div
					className='action_wrap flex justify_center align_center cursor_point clickable'
					onClick={onCheck}
				>
					<Switch>
						<Case condition={status === 'unchecked' || status === 'closed'}>
							<Square size={14} />
						</Case>
						<Case condition={status === 'checked'}>
							<CheckSquare size={14} />
						</Case>
					</Switch>
				</div>
				<span
					className={$cx('todo_text cursor_point', !open && children?.length > 0 && 'has_children')}
					data-children={children_status}
					onClick={toggleChildren}
				>
					{text}
				</span>
			</div>
			<AnimatePresence>
				{open && children && (
					<motion.div
						className={'children_wrap w_100 border_box'}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.18 }}
					>
						<div className='children_wrap w_100 border_box flex flex_column'>
							{children.map((child, child_index) => (
								<ChildrenItem
									item={child}
									index={child_index}
									updateChildStatus={updateChildStatus}
									key={child_index}
								></ChildrenItem>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default $app.memo(Index)
