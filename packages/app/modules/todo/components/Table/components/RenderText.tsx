import { useMemoizedFn } from 'ahooks'

import { todo } from '@/appdata'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['text']>) => {
	const { value, editing, onFocus, onBlur, onChange } = props

	const change = useMemoizedFn(({ target: { value } }) => onChange(value))

	return editing ? (
		<input
			className={$cx('w_100', styles.RenderText)}
			maxLength={todo.text_max_length}
			value={value || ''}
			onChange={change}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	) : (
		<span className={$cx('w_100', styles.RenderText)}>{value}</span>
	)
}

export default $app.memo(Index)
