import { Minus } from '@phosphor-icons/react'

import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['children']>) => {
	const { value } = props

	const checked_children = value?.filter(item => item.status === 'checked')

	return (
		<div
			className={$cx(
				'flex justify_center align_center',
				styles.RenderChildren,
				!value?.length && styles.no_children
			)}
		>
			{value?.length ? `${checked_children?.length}/${value.length}` : <Minus size={14}></Minus>}
		</div>
	)
}

export default $app.memo(Index)
