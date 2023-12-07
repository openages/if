import { ScrollMenu } from 'react-horizontal-scrolling-menu'

import { onWheel } from '@/utils'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import View from './View'
import styles from './index.css'

import type { IPropsStacksNavBarColumn } from '../../../../types'

const Index = (props: IPropsStacksNavBarColumn) => {
	const { column, column_index, focus, click, remove, update, move } = props

	return (
		<div className={$cx('border_box relative', styles.Column)} style={{ width: column.width }}>
			<div className='bottom_line w_100 absolute bottom_0'></div>
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
