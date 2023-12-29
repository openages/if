import Remind from '../../Remind'
import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

const Index = (props: CustomFormItem<Todo.Todo['remind_time']>) => {
	const { value, onChange } = props

	return (
		<div className={styles.RenderRemind}>
			<Remind useByDetail remind_time={value} onChangeRemind={onChange}></Remind>
		</div>
	)
}

export default $app.memo(Index)
