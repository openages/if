import { useMemoizedFn } from 'ahooks'
import { omit } from 'lodash-es'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Else, If, Then, When } from 'react-if'

import { SimpleEmpty } from '@/components'
import { useElementScrollRestoration } from '@/hooks'
import { DirTree } from '@/types'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import DirItem from '../DirItem'

import type { IPropsDirItems } from '../../types'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

const Index = (props: IPropsDirItems) => {
	const { module, data, loading, current_item, focusing_item, open_folder, onClick, showDirTreeOptions } = props
	const [active_item, setActiveItem] = useState<{ item: DirTree.Item; open: boolean } | null>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
	const scroll_restore = useElementScrollRestoration('todo.dirtree')

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
		<div
			className={$cx('dir_tree_wrap w_100 border_box flex flex_column', !data.length && 'empty')}
			{...scroll_restore}
		>
			<If condition={data.length > 0}>
				<Then>
					<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
						{data.map((item, index) => (
							<DirItem
								{...{
									module,
									current_item,
									focusing_item,
									open_folder,
									sensors,
									onClick,
									showDirTreeOptions
								}}
								item={omit(item, 'sort')}
								parent_index={[index]}
								key={item.id}
							></DirItem>
						))}
						{active_item &&
							createPortal(
								<DragOverlay>
									<DirItem
										{...{
											module,
											current_item,
											focusing_item,
											open_folder,
											sensors,
											onClick,
											showDirTreeOptions
										}}
										dragging={true}
										item={active_item.item}
									></DirItem>
								</DragOverlay>,
								document.body
							)}
					</DndContext>
				</Then>
				<Else>
					<When condition={!loading}>
						<SimpleEmpty></SimpleEmpty>
					</When>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
