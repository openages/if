import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsTabsNavBar } from '../../../../types'

const Index = (props: IPropsTabsNavBar) => {
	const { stacks, remove, active, update, move } = props
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

	return (
            <div className={ $cx('w_100 border_box flex sticky top_0', styles._local) }>
                  <div className="bottom_line w_100 absolute bottom_0"></div>
			<DndContext sensors={sensors} onDragEnd={move}>
				<SortableContext items={stacks} strategy={horizontalListSortingStrategy}>
					{stacks.map((item, index) => (
						<Item index={index} key={item.file.id} {...{ item, remove, active, update }}></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default $app.memo(Index)
