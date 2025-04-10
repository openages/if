import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { SimpleEmpty } from '@/components'
import { DirTree } from '@/types'
import { useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'

import DirItem from '../DirItem'

import type { IPropsDirItems } from '../../types'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

const Index = (props: IPropsDirItems) => {
	const {
		module,
		data,
		loading,
		current_item,
		focusing_item,
		open_folder,
		star_ids,
		onClick,
		showDirTreeOptions,
		onStar
	} = props
	const [active_item, setActiveItem] = useState<{ item: DirTree.Item; open: boolean } | null>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

	const onDragStart = useMemoizedFn((args: DragStartEvent) => {
		const { active } = args

		setActiveItem({ item: active.data.current!.item, open: active.data.current!.open })
	})

	const onDragEnd = useMemoizedFn((args: DragEndEvent) => {
		const { active, over } = args

		setActiveItem(null)

		$app.Event.emit(`${module}/dirtree/move`, { active, over })
	})

	return (
		<div className={$cx('dir_tree_wrap w_100 border_box flex flex_column', !data.length && 'empty')}>
			<Choose>
				<When condition={data.length > 0}>
					<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
						{data.map((item, index) => (
							<DirItem
								{...{
									item,
									module,
									current_item,
									focusing_item,
									open_folder,
									sensors,
									onClick,
									showDirTreeOptions,
									onStar
								}}
								star={star_ids.includes(item.id)}
								parent_index={[index]}
								key={item.id}
							></DirItem>
						))}
						{active_item &&
							createPortal(
								<DragOverlay zIndex={1001}>
									<DirItem
										{...{
											module,
											current_item,
											focusing_item,
											open_folder,
											sensors,
											onClick,
											showDirTreeOptions,
											onStar
										}}
										star={star_ids.includes(active_item.item.id)}
										dragging={true}
										item={active_item.item}
									></DirItem>
								</DragOverlay>,
								document.body
							)}
					</DndContext>
				</When>
				<Otherwise>
					<If condition={!loading}>
						<SimpleEmpty></SimpleEmpty>
					</If>
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
