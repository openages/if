import Cycle from '../../Cycle'
import styles from '../index.css'

import type { CustomFormItem, Todo } from '@/types'

interface IProps extends CustomFormItem<Todo.Todo['cycle']> {
	cycle_enabled: Todo.Todo['cycle_enabled']
}

const Index = (props: IProps) => {
	const { value, cycle_enabled, onChange } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderCycle)}>
			<Cycle useByDetail cycle={value} cycle_enabled={cycle_enabled} onChangeCircle={onChange}></Cycle>
		</div>
	)
}

export default $app.memo(Index)
