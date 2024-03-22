import { useMemoizedFn } from 'ahooks'

import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'

import type { Todo } from '@/types'

interface IProps {
	item: Todo.Todo['children'][number]
	index: number
	updateChildStatus: (index: number, status: Todo.Todo['children'][number]['status']) => void
}

const Index = (props: IProps) => {
	const { item, index, updateChildStatus } = props
	const { text, status } = item

	const onCheck = useMemoizedFn(() => {
		updateChildStatus(index, status === 'unchecked' ? 'checked' : 'unchecked')
	})

	return (
		<div className={$cx('w_100 border_box flex', styles.ChildrenItem, styles[status])}>
			<div
				className='action_wrap flex justify_center align_center cursor_point clickable'
				onClick={onCheck}
			>
				<Choose>
					<When condition={status === 'unchecked'}>
						<Square size={14} />
					</When>
					<When condition={status === 'checked'}>
						<CheckSquare size={14} />
					</When>
				</Choose>
			</div>
			<span className='todo_text'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
