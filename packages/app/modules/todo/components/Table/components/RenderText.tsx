import { Input } from 'antd'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['text']>) => {
	const { value, onChange } = props

	return <Input className={styles.RenderText} variant='borderless' value={value} onChange={onChange}></Input>
}

export default $app.memo(Index)
