import { useMemo } from 'react'

import QuadTodoItem from '../QuadTodoItem'
import styles from './index.css'

import type { IPropsTodos } from '../../types'
import type { Todo } from '@/types'

const Index = (props: IPropsTodos) => {
	const {
		mode,
		items,
		angles: _angles,
		tags,
		open_items,
		dimension_id,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props

	const angles = useMemo(() => _angles.filter(item => item.id !== dimension_id), [_angles, dimension_id])

	return (
		<div className={$cx('limited_content_wrap relative', styles._local)}>
			<div className='todo_items_wrap w_100 flex flex_column'>
				{items.map((item, index) => (
					<QuadTodoItem
						{...{
							mode,
							index,
							tags,
							angles,
							open_items,
							dimension_id,
							check,
							updateRelations,
							insert,
							update,
							tab,
							moveTo,
							remove,
							handleOpenItem,
							showDetailModal
						}}
						item={item as Todo.Todo}
						key={item.id}
					></QuadTodoItem>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
