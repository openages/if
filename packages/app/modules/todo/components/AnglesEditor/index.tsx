import { useMemoizedFn } from 'ahooks'

import { id } from '@/utils'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'

import type { IPropsCustomFormItem } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

interface IProps extends IPropsCustomFormItem<Array<{ id: string; text: string }>> {
	exclude_angles: Array<string>
	remove: (id: string) => Promise<boolean>
	setExcludeAngles: (v: IProps['exclude_angles']) => void
}

const Index = (props: IProps) => {
	const { value = [], exclude_angles, onChange, remove, setExcludeAngles } = props

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return false
		if (active.id === over.id) return

		onChange!(arrayMove(value, active.data.current!.index as number, over.data.current!.index as number))
	})

	const onExclude = useMemoizedFn((index: number) => {
		const target_id = value[index].id

		if (exclude_angles.includes(target_id)) {
			setExcludeAngles(exclude_angles.filter(item => item !== target_id))
		} else {
			if (exclude_angles.length === value.length - 1) return

			setExcludeAngles([...exclude_angles, target_id])
		}
	})

	const onAdd = useMemoizedFn(index => {
		const items = $copy(value)

		items.splice(index + 1, 0, { id: id(), text: '' })

		onChange!(items)
	})

	const onRemove = useMemoizedFn(async index => {
		const target_id = value[index].id
		const res = await remove(target_id)

		if (!res) return

		const items = $copy(value)

		items.splice(index, 1)

		if (exclude_angles.length === value.length - 1 && !exclude_angles.includes(target_id)) {
			const target_exclude_angles = $copy(exclude_angles)

			target_exclude_angles.splice(0, 1)

			setExcludeAngles(target_exclude_angles)
		}

		if (exclude_angles.includes(target_id)) {
			setExcludeAngles(exclude_angles.filter(item => item !== target_id))
		}

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
							exclude={exclude_angles.includes(item.id)}
							key={item.id}
							{...{ onExclude, onAdd, onRemove, onUpdate }}
						></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default $app.memo(Index)
