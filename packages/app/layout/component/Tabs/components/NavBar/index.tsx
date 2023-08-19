import { ScrollMenu } from 'react-horizontal-scrolling-menu'

import { onWheel } from '@/utils'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsTabsNavBar } from '../../../../types'

const Index = (props: IPropsTabsNavBar) => {
	const { stacks, remove, active, update, move } = props
      const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

	return (
		<div className={$cx('w_100 border_box sticky top_0', styles._local)}>
			<div className='bottom_line w_100 absolute bottom_0'></div>
			<DndContext sensors={sensors} modifiers={[restrictToHorizontalAxis]} onDragEnd={move}>
				<SortableContext items={stacks} strategy={horizontalListSortingStrategy}>
					<ScrollMenu onWheel={onWheel}>
						{stacks.map((item, index) => (
							<Item
								index={index}
								key={item.id}
								{...{ item, remove, active, update }}
							></Item>
						))}
					</ScrollMenu>
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default $app.memo(Index)
