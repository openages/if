import { useMemoizedFn } from 'ahooks'

import { useText, useTextChange, Text } from '@/Editor'
import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'

import type { Todo } from '@/types'

interface IProps {
	item: Required<Todo.Todo>['children'][number]
	index: number
	updateChildStatus: (index: number, status: Required<Todo.Todo>['children'][number]['status']) => void
}

const Index = (props: IProps) => {
	const { item, index, updateChildStatus } = props
	const { text, status } = item

	const { ref_editor, onChange, setEditor, setRef } = useText({ text })

	useTextChange({ ref_editor, text })

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
						<Square size={16} />
					</When>
					<When condition={status === 'checked'}>
						<CheckSquare size={16} />
					</When>
				</Choose>
			</div>
			<Text className='todo_text' readonly onChange={onChange} setEditor={setEditor} setRef={setRef}></Text>
		</div>
	)
}

export default $app.memo(Index)
