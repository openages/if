import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import Item from './Item'

import type { IPropsDirItem_File, IPropsDirItem_Item } from '../../../types'

const Index = (props: IPropsDirItem_File) => {
	const {
		module,
		item,
		current_item,
		focusing_item,
		parent_index = [],
		dragging,
		browser_mode,
		onClick,
		showDirTreeOptions
	} = props
	const { attributes, listeners, transform, isDragging, setNodeRef } = useDraggable({
		id: item.id,
		data: { item, parent_index }
	})

	const props_item: IPropsDirItem_Item = {
		module,
		item,
		current_item,
		focusing_item,
		parent_index,
		dragging,
		browser_mode,
		showDirTreeOptions,
		onClick
	}

	return (
		<div
			className={$cx('file_wrap w_100', isDragging && 'isDragging')}
			style={{ transform: CSS.Translate.toString(transform) }}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
		>
			<Item {...props_item}></Item>
		</div>
	)
}

export default $app.memo(Index)
