import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useSensor, useSensors, DndContext, PointerSensor } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'
import Model from './model'

interface IProps {
	ids: Array<string>
	onChange: (ids: Array<string>) => void
}

const Index = (props: IProps) => {
	const { ids, onChange } = props
	const [x] = useState(() => container.resolve(Model))
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

	const items = $copy(x.items)

	useLayoutEffect(() => {
		x.init(ids, onChange)

		return () => x.off()
	}, [ids])

	const updateTodoItem = useMemoizedFn(x.updateTodoItem)
	const changeStatus = useMemoizedFn(x.changeStatus)
	const check = useMemoizedFn(x.check)
	const remove = useMemoizedFn(x.remove)
	const onDragEnd = useMemoizedFn(x.onDragEnd)

	if (!ids.length) return <div className={$cx('w_100 pt_6 pb_6', styles.empty)}>未添加待办</div>

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<DndContext onDragEnd={onDragEnd} sensors={sensors}>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					{items.map((item, index) => (
						<Item
							item={item}
							index={index}
							updateTodoItem={updateTodoItem}
							changeStatus={changeStatus}
							check={check}
							remove={remove}
							key={item.id}
						></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
