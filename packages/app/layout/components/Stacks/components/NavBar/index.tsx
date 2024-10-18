import Column from './Column'
import styles from './index.css'

import type { IPropsStacksNavBar } from '../../../../types'

const Index = (props: IPropsStacksNavBar) => {
	const { columns, focus, resizing, click, remove, update } = props

	return (
		<div className='w_100 flex relative'>
			<div className={$cx('w_100 absolute bottom_0', styles.bottom_line)}></div>
			{columns.map((column, column_index) => (
				<Column
					{...{ column, column_index, focus, resizing, click, remove, update }}
					column_is_last={column_index === columns.length - 1}
					key={column_index}
				></Column>
			))}
		</div>
	)
}

export default $app.memo(Index)
