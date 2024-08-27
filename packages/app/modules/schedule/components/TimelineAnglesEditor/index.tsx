import { useMemoizedFn } from 'ahooks'

import { getIds, id } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import Item from './Item'

import type { IPropsCustomFormItem, Schedule } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'
import type { IPropsSettingsModal } from '../../types'

interface IProps
	extends IPropsCustomFormItem<Array<Schedule.TimelineAngle>>,
		Pick<IPropsSettingsModal, 'removeTimelineAngle' | 'removeTimelineRow'> {}

const Index = (props: IProps) => {
	const { value = [], onChange, removeTimelineAngle, removeTimelineRow } = props

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return false
		if (active.id === over.id) return

		onChange!(arrayMove(value, active.data.current!.index as number, over.data.current!.index as number))
	})

	const onAdd = useMemoizedFn(index => {
		const items = $copy(value)

		items.splice(index + 1, 0, { id: id(), text: '', rows: getIds(3) })

		onChange!(items)
	})

	const onAddRow = useMemoizedFn(index => {
		const items = $copy(value)

		items[index].rows.push(id())

		onChange!(items)
	})

	const onRemove = useMemoizedFn(async index => {
		const res = await removeTimelineAngle(value[index].id)

		if (!res) return

		const items = $copy(value)

		items.splice(index, 1)

		onChange!(items)
	})

	const onRemoveRow = useMemoizedFn(async (index, row_index) => {
		const res = await removeTimelineRow(value[index].id, value[index].rows[row_index])

		if (!res) return

		const items = $copy(value)

		items[index].rows.splice(row_index, 1)

		onChange!(items)
	})

	const onUpdate = useMemoizedFn((index, v) => {
		const items = $copy(value)

		items[index].text = v

		onChange!(items)
	})

	return (
		<div className={$cx('w_100 flex flex_column')}>
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext items={value} strategy={verticalListSortingStrategy}>
					{value.map((item, index) => (
						<Item
							item={item}
							index={index}
							limitMin={value.length === 1}
							limitMax={value.length >= 30}
							last={index === value.length - 1}
							key={item.id}
							{...{ onAdd, onAddRow, onRemove, onRemoveRow, onUpdate }}
						></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default $app.memo(Index)
