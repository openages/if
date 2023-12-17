import Column from './Column'

import type { IPropsStacksContent } from '../../../../types'

const Index = (props: IPropsStacksContent) => {
	const { columns, container_width, resizing, click, resize, setResizing } = props

	return (
		<div className='w_100 flex'>
			{columns.map((column, index) => (
				<Column
					column={column}
					column_index={index}
					width={column.width}
					container_width={container_width}
					resizing={resizing}
					click={click}
					resize={resize}
					setResizing={setResizing}
					key={index}
				></Column>
			))}
		</div>
	)
}

export default $app.memo(Index)
