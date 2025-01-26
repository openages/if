import FlatLevel from '../../FlatLevel'
import Level from '../../Level'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['level']>) => {
	const { value, editing, onFocus, onBlur, onChange } = props

	return (
		<div className={$cx('flex justify_center', styles.RenderLevel)}>
			{editing ? (
				<Level value={value} onChangeLevel={onChange!} onFocus={onFocus} onBlur={onBlur}></Level>
			) : (
				<div className='w_100 flex justify_center align_center'>
					<FlatLevel as_label value={value}></FlatLevel>
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
