import { onWheel } from '@/utils'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { ScrollMenu } from 'react-horizontal-scrolling-menu'
import View from './View'
import styles from './index.css'

import type { IPropsStacksNavBarColumn } from '../../../../types'

const Index = (props: IPropsStacksNavBarColumn) => {
	const { column, column_index, focus, resizing, click, remove, update } = props
	const { active, isOver, setNodeRef } = useDroppable({
		id: `nav_column_${column_index}`,
		data: { type: 'stack', column: column_index }
	})

	return (
		<div
			className={$cx(
				'border_box relative',
				styles.Column,
				resizing && styles.resizing,
				active?.data?.current?.column !== column_index && isOver && styles.isOver
			)}
			style={{ width: `${column.width}%` }}
			ref={setNodeRef}
		>
			<SortableContext items={column.views} strategy={horizontalListSortingStrategy}>
				<ScrollMenu onWheel={onWheel}>
					{column.views.map((view, view_index) => (
						<View
							{...{ column_index, view_index, view, focus, click, remove, update }}
							key={view.id}
						></View>
					))}
				</ScrollMenu>
			</SortableContext>
		</div>
	)
}

export default $app.memo(Index)
