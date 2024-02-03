import { useMemoizedFn } from 'ahooks'
import { Drawer } from 'antd'

import { DndContext } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsSessionsEditModal } from '../../types'
import type { DragEndEvent } from '@dnd-kit/core'

const Index = (props: IPropsSessionsEditModal) => {
	const { visible_edit_modal, data, update, remove, move, close } = props

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return
		if (active.id === over.id) return

		move(active.data.current.index as number, over.data.current.index as number)
	})

	return (
		<Drawer
			rootClassName={$cx('useInPage', styles._local)}
			open={visible_edit_modal}
			mask={false}
			width={90}
			zIndex={100}
			destroyOnClose
			getContainer={false}
			onClose={close}
		>
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext items={data.sessions} strategy={rectSortingStrategy}>
					<div className='session_items w_100 border_box flex flex_column'>
						{data.sessions.map((item, index) => (
							<Item
								{...{ update, remove }}
								item={item}
								index={index}
								disabled={data.status && data.index === index}
								key={item.id}
							></Item>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</Drawer>
	)
}

export default $app.memo(Index)
