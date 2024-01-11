import { useMemoizedFn } from 'ahooks'
import { Case, Switch } from 'react-if'

import { CheckCircle, CheckSquare, Circle, Square } from '@phosphor-icons/react'

import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['status']> & { linked?: string }) => {
	const { value, linked, onChange } = props

	const onCheck = useMemoizedFn(() => {
		if (value === 'closed') return

		onChange(value === 'unchecked' ? 'checked' : 'unchecked')
	})

	return (
		<div
			className={$cx(
				'flex border_box justify_center align_center cursor_point clickable',
				styles.RenderStatus
			)}
			onClick={onCheck}
		>
			<Switch>
				<Case condition={value === 'unchecked' || value === 'closed'}>
					{linked ? <Circle size={16} weight='duotone' /> : <Square size={16} weight='regular' />}
				</Case>
				<Case condition={value === 'checked'}>
					{linked ? <CheckCircle size={16} weight='duotone' /> : <CheckSquare size={16} />}
				</Case>
			</Switch>
		</div>
	)
}

export default $app.memo(Index)
