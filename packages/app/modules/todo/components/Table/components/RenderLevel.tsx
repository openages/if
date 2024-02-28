import Level from '../../Level'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['level']>) => {
	const { value, onChange } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderLevel)}>
			<Level value={value} onChangeLevel={onChange}></Level>
		</div>
	)
}

export default $app.memo(Index)
