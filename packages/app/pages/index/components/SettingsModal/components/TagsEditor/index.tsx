import { useMemoizedFn } from 'ahooks'
import { theme } from 'antd'
import { cloneDeep } from 'lodash-es'
import { nanoid } from 'nanoid'

import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsCustomFormItem } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

const { useToken } = theme

const Index = (props: IPropsCustomFormItem<Array<{ id: string; color: string; text: string }>>) => {
	const { value, onChange } = props
	const { token } = useToken()

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (active.id === over.id) return

		onChange(arrayMove(value, active.data.current.index as number, over.data.current.index as number))
	})

	const onAdd = useMemoizedFn((index) => {
		const items = cloneDeep(value)

		items.splice(index + 1, 0, { id: nanoid(), color: token.colorPrimary, text: '' })

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
