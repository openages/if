import DateTime from '../../DateTime'
import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['end_time']>) => {
	const { value, onChange } = props

	return (
		<div className={styles.DateTime}>
			<DateTime useByDetail ignoreDetail value={value} onChange={onChange}></DateTime>
		</div>
	)
}

export default $app.memo(Index)
