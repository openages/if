import { useMemoizedFn } from 'ahooks'
import { Case, Switch } from 'react-if'

import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['status']>) => {
	const { value, onChange } = props

	const onCheck = useMemoizedFn(() => {
		if (value === 'closed') return

		onChange(value === 'unchecked' ? 'checked' : 'unchecked')
	})

	return (
		<div
			className={$cx('flex justify_center align_center cursor_point clickable', styles.RenderStatus)}
			onClick={onCheck}
		>
			<Switch>
				<Case condition={value === 'unchecked' || value === 'closed'}>
					<Square size={16} />
				</Case>
				<Case condition={value === 'checked'}>
					<CheckSquare size={16} />
				</Case>
			</Switch>
		</div>
	)
}

export default $app.memo(Index)
