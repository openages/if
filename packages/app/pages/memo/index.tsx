import { cloneDeep } from 'lodash-es'
import { Fragment, useState } from 'react'

import { isRelated, move } from '@/utils/tree'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import _data from './_data'
import styles from './index.css'

const SortableItem = ({ children, id, item, parent_index, parent }: any) => {
	const { listeners, setNodeRef, transform, transition, isOver, items, over, active } = useSortable({
		id,
		data: { parent_index, item, parent }
	})

	return (
		<div
			className={$cx(
				'sortable_wrap',
				isOver && !isRelated(active, over) && !items.includes(active!.id) && 'isOver'
			)}
			{...listeners}
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
		>
			{children}
		</div>
	)
}

const Items = ({ data, parent_index = [], parent = [] }: any) => {
	return (
		<Fragment>
			{data.map((item: any, index: number) => {
				if (item.children) {
					return (
						<SortableItem
							id={item.id}
							item={item}
							parent_index={parent_index}
							parent={parent.length > 0 ? parent : data}
							key={item.id}
						>
							<div className='item flex flex_column'>
								{item.id}
								<div
									className='children_wrap'
									style={{ paddingLeft: 6 * parent_index.length }}
								>
									<SortableContext
										id={item.id}
										items={item.children}
										strategy={verticalListSortingStrategy}
									>
										<Items
											data={item.children}
											key={item.id}
											parent_index={[...parent_index, index]}
										></Items>
									</SortableContext>
								</div>
							</div>
						</SortableItem>
					)
				}

				return (
					<SortableItem
						id={item.id}
						item={item}
						parent_index={parent_index}
						parent={parent.length > 0 ? parent : data}
						key={item.id}
					>
						<div className='item'>{item.id}</div>
					</SortableItem>
				)
			})}
		</Fragment>
	)
}

const Index = () => {
	const [data, setData] = useState(_data)
	const [active, setActive] = useState<any>('')
	const items = cloneDeep(data)

	return (
		<div className={$cx('w_100 h_100vh flex flex_column justify_center align_center', styles._local)}>
			<div className='items_wrap flex flex_column'>
				<DndContext
					onDragStart={({ active }) => {
						setActive(active.id)
					}}
					onDragEnd={({ active, over }) => {
						setActive('')

						const target = move(data, active, over)

						console.log(123)

						if (!target) return

						setData(target)
					}}
				>
					<SortableContext items={items} strategy={verticalListSortingStrategy}>
						<div className='items flex flex_column'>
							<Items data={items}></Items>
						</div>
						<DragOverlay>
							{active && (
								<SortableItem id={active}>
									<div className='item'>{active}</div>
								</SortableItem>
							)}
						</DragOverlay>
					</SortableContext>
				</DndContext>
			</div>
		</div>
	)
}

export default $app.memo(Index)
