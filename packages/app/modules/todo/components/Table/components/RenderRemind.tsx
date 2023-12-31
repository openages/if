import Remind from '../../DateTime'
import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['remind_time']>) => {
	const { value, onChange } = props

	return (
		<div className={styles.RenderRemind}>
			<Remind useByDetail value={value} onChange={onChange}></Remind>
		</div>
	)
}

export default $app.memo(Index)
