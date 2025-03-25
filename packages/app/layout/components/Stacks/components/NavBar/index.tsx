import Column from './Column'

import type { IPropsStacksNavBar } from '../../../../types'

const Index = (props: IPropsStacksNavBar) => {
	const { columns, focus, resizing, click, remove, update, showHomeDrawer } = props

	return (
		<div className='w_100 flex relative'>
			{columns.map((column, column_index) => (
				<Column
					{...{ column, column_index, focus, resizing, click, remove, update, showHomeDrawer }}
					show_homepage_btn={column_index === 0}
					column_is_last={column_index === columns.length - 1}
					key={column_index}
				></Column>
			))}
		</div>
	)
}

export default $app.memo(Index)
