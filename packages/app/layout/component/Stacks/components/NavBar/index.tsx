import type { IPropsStacksNavBar } from '../../../../types'
import Column from './Column'
import styles from './index.css'

const Index = (props: IPropsStacksNavBar) => {
	const { columns, focus, click, remove, update } = props

	return (
		<div className='w_100 flex relative'>
			<div className={$cx('w_100 absolute bottom_0', styles.bottom_line)}></div>
			{columns.map((column, column_index) => (
				<Column {...{ column, column_index, focus, click, remove, update }} key={column_index}></Column>
			))}
		</div>
	)
}

export default $app.memo(Index)
