import { useMemoizedFn } from 'ahooks'
import { theme } from 'antd'
import { cloneDeep } from 'lodash-es'

import { id } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { Plus } from '@phosphor-icons/react'

import styles from './index.css'
import Item from './Item'

import type { IPropsCustomFormItem } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

const { useToken } = theme

const Index = (props: IPropsCustomFormItem<Array<{ id: string; color: string; text: string }>>) => {
	const { value = [], onChange } = props
	const { token } = useToken()

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return false
		if (active.id === over.id) return

		onChange(arrayMove(value, active.data.current.index as number, over.data.current.index as number))
	})

	const onAdd = useMemoizedFn((index) => {
		const items = cloneDeep(value)

		items.splice(index + 1, 0, { id: id(), color: token.colorPrimary, text: '' })

		onChange(items)
	})

	const onRemove = useMemoizedFn((index) => {
		const items = cloneDeep(value)

		items.splice(index, 1)

		onChange(items)
	})

	const onUpdate = useMemoizedFn((key, index, v) => {
		const items = cloneDeep(value)

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
