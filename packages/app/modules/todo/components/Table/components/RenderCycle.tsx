import Cycle from '../../Cycle'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['cycle']>) => {
	const { value, deps, onChange } = props
	const { cycle_enabled } = deps

	return (
		<div className={$cx('flex justify_center', styles.RenderCycle)}>
			<Cycle useByDetail cycle={value} cycle_enabled={cycle_enabled} onChangeCircle={onChange}></Cycle>
		</div>
	)
}

export default $app.memo(Index)
