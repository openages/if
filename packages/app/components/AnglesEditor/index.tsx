import { useMemoizedFn } from 'ahooks'

import { id } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsCustomFormItem } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

interface IProps extends IPropsCustomFormItem<Array<{ id: string; text: string }>> {
	remove: (id: string) => Promise<boolean>
}

const Index = (props: IProps) => {
	const { value = [], onChange, remove } = props

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return false
		if (active.id === over.id) return

		onChange!(arrayMove(value, active.data.current!.index as number, over.data.current!.index as number))
	})

	const onAdd = useMemoizedFn(index => {
		const items = $copy(value)

		items.splice(index + 1, 0, { id: id(), text: '' })

		onChange!(items)
	})

	const onRemove = useMemoizedFn(async index => {
		const res = await remove(value[index].id)

		if (!res) return

		const items = $copy(value)

		items.splice(index, 1)

		onChange!(items)
	})

	const onUpdate = useMemoizedFn((index, v) => {
		const items = $copy(value)

		items[index].text = v

		onChange!(items)
	})

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext items={value} strategy={verticalListSortingStrategy}>
					{value.map((item, index) => (
						<Item
							item={item}
							index={index}
							limitMin={value.length === 1}
							limitMax={value.length >= 12}
							key={item.id}
							{...{ onAdd, onRemove, onUpdate }}
						></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default $app.memo(Index)
