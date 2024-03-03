import Cycle from '../../Cycle'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['cycle']>) => {
	const { value, deps, editing, onFocus, onChange, onRowChange } = props
	const { cycle_enabled } = deps

	return (
		<div className={$cx('flex justify_center', styles.RenderCycle)}>
			<Cycle
				useByDetail
				unEditing={!editing}
				cycle={value}
				cycle_enabled={cycle_enabled}
				onFocus={onFocus}
				onChange={onChange}
				onChangeItem={onRowChange}
			></Cycle>
		</div>
	)
}

export default $app.memo(Index)
