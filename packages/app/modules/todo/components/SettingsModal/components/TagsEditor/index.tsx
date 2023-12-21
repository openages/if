import { useMemoizedFn } from 'ahooks'

import genColor from 'uniqolor'

import { id } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from '@phosphor-icons/react'

import Item from './Item'
import styles from './index.css'

import type { IPropsCustomFormItem } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

interface IProps extends IPropsCustomFormItem<Array<{ id: string; color: string; text: string }>> {
	remove: (id: string) => Promise<boolean>
}

const Index = (props: IProps) => {
	const { value = [], onChange, remove } = props

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return false
		if (active.id === over.id) return

		onChange(arrayMove(value, active.data.current.index as number, over.data.current.index as number))
	})

	const onAdd = useMemoizedFn(index => {
		const items = $copy(value)

		items.splice(index + 1, 0, {
			id: id(),
			color: genColor.random().color,
			text: ''
		})

		onChange(items)
	})

	const onRemove = useMemoizedFn(async index => {
		const res = await remove(value[index].id)

		if (!res) return

		const items = $copy(value)

		items.splice(index, 1)

		onChange(items)
	})

	const onUpdate = useMemoizedFn((key, index, v) => {
		const items = $copy(value)

		items[index][key] = v

		onChange(items)
	})

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext items={value} strategy={verticalListSortingStrategy}>
					{value.length ? (
						value.map((item, index) => (
							<Item
								item={item}
								index={index}
								limitMax={value.length >= 12}
								key={item.id}
								{...{ onAdd, onRemove, onUpdate }}
							></Item>
						))
					) : (
						<div
							className='w_100 btn_make border_box flex justify_center align_center clickable'
							onClick={() => onAdd(0)}
						>
							<Plus size={18}></Plus>
						</div>
					)}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default $app.memo(Index)
