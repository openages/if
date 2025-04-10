import { useMemoizedFn } from 'ahooks'
import genColor from 'uniqolor'

import { SortableWrap } from '@/components'
import { id } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Plus } from '@phosphor-icons/react'

import styles from './index.css'
import Item from './Item'

import type { IPropsCustomFormItem } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

interface IProps extends IPropsCustomFormItem<Array<{ id: string; color: string; text: string }>> {
	pureColor?: boolean
	remove: (id: string) => Promise<boolean>
}

const Index = (props: IProps) => {
	const { value = [], pureColor, onChange, remove } = props

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return false
		if (active.id === over.id) return

		onChange!(arrayMove(value, active.data.current!.index as number, over.data.current!.index as number))
	})

	const onAdd = useMemoizedFn(index => {
		const items = $copy(value)

		items.splice(index + 1, 0, {
			id: id(),
			color: genColor.random({ lightness: [24, 72] }).color,
			text: ''
		})

		onChange!(items)
	})

	const onRemove = useMemoizedFn(async index => {
		const res = await remove(value[index].id)

		if (!res) return

		const items = $copy(value)

		items.splice(index, 1)

		onChange!(items)
	})

	const onUpdate = useMemoizedFn((key: 'id' | 'color' | 'text', index: number, v) => {
		const items = $copy(value)

		items[index][key] = v

		onChange!(items)
	})

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{value.length ? (
				<DndContext onDragEnd={onDragEnd}>
					<SortableContext items={value} strategy={verticalListSortingStrategy}>
						{value.map((item, index) => (
							<SortableWrap id={item.id} data={{ index }} key={item.id}>
								<Item
									item={item}
									index={index}
									limitMax={false}
									pureColor={pureColor}
									{...{ onAdd, onRemove, onUpdate }}
								></Item>
							</SortableWrap>
						))}
					</SortableContext>
				</DndContext>
			) : (
				<div
					className={$cx(
						'w_100 border_box flex justify_center align_center clickable',
						styles.btn_make
					)}
					onClick={() => onAdd(0)}
				>
					<Plus size={18}></Plus>
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
