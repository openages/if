import { useSensor, useSensors, DndContext, PointerSensor } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsHomeDrawerFiles } from '@/layout/types'

const Index = (props: IPropsHomeDrawerFiles) => {
	const { tab, files, setStar, onFile, onStarFilesDragEnd } = props
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			<div className='file_items w_100 flex flex_column'>
				<DndContext sensors={sensors} onDragEnd={onStarFilesDragEnd}>
					<SortableContext
						items={files}
						disabled={tab === 'latest'}
						strategy={verticalListSortingStrategy}
					>
						{files.map(item => (
							<Item {...{ tab, item, setStar, onFile }} key={item.id}></Item>
						))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	)
}

export default $app.memo(Index)
