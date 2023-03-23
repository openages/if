import { useMemoizedFn } from 'ahooks'
import { Else, If, Then } from 'react-if'

import { SimpleEmpty } from '@/components'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import DirItem from '../DirItem'

import type { IPropsDirItems } from '../../types'
import type { DragEndEvent } from '@dnd-kit/core'

const Index = (props: IPropsDirItems) => {
	const { module, data, current_item, fold_all, onClick, setFoldAll, showDirTreeOptions } = props

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

	const onDragEnd = useMemoizedFn((args: DragEndEvent) => {
		const { active, over } = args

		$app.Event.emit(`${module}/dirtree/move`, { active_id: active.id, over_id: over?.id })
	})

	return (
		<div className={$cx('dir_tree_wrap w_100 border_box flex flex_column', !data.length && 'empty')}>
			<If condition={data.length > 0}>
				<Then>
					<DndContext sensors={sensors} onDragEnd={onDragEnd}>
						<SortableContext items={data}>
							{data.map((item) => (
								<DirItem
									{...{
										module,
										item,
										current_item,
										fold_all,
										onClick,
										setFoldAll,
										showDirTreeOptions
									}}
									key={item.id}
								></DirItem>
							))}
						</SortableContext>
					</DndContext>
				</Then>
				<Else>
					<SimpleEmpty></SimpleEmpty>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
