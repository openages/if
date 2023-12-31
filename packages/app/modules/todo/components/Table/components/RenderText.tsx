import { Input } from 'antd'

import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'
const Index = (props: CustomFormItem<Todo.Todo['text']>) => {
	const { value, onChange } = props

	return <Input className={styles.RenderText} bordered={false} value={value} onChange={onChange}></Input>
}

export default $app.memo(Index)
