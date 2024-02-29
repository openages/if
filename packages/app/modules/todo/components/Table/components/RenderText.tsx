import { useMemoizedFn } from 'ahooks'

import { todo } from '@/appdata'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['text']>) => {
	const { value, onChange } = props

	const change = useMemoizedFn(({ target: { value } }) => onChange(value))

	return (
		<input
			className={styles.RenderText}
			maxLength={todo.text_max_length}
			value={value || ''}
			onChange={change}
		/>
	)
}

export default $app.memo(Index)
