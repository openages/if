import Column from './Column'
import styles from './index.css'

import type { IPropsStacksNavBar } from '../../../../types'

const Index = (props: IPropsStacksNavBar) => {
	const { columns, focus, click, remove, update, move } = props

	return (
		<div className={$cx(styles._local)}>
			{columns.map((column, column_index) => (
				<Column
					{...{ column, column_index, focus, click, remove, update, move }}
					key={column_index}
				></Column>
			))}
		</div>
	)
}

export default $app.memo(Index)
