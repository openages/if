import { remove } from 'lodash-es'

import { arrayMove } from '@dnd-kit/sortable'

import isRelated from './isRelated'

import type { UniqueIdentifier, Active, Over } from '@dnd-kit/core'
import type { SortableData } from '@dnd-kit/sortable'

type Data = SortableData & {
	parent_index: Array<number>
	item: ItemWithChildren
}

type Item = {
	id: UniqueIdentifier
}

type ItemWithChildren = {
	id: UniqueIdentifier
	children: Array<ItemWithChildren>
}

export default <T>(items: Array<T & Item>, active: Active, over: Over | null) => {
	if (!over?.id) return false
	if (isRelated(active, over)) return false

	const {parent_index:active_parent_index,item:active_item} = active.data.current as Data
	const {parent_index:over_parent_index,item:over_item} = over.data.current as Data

	return items
}
