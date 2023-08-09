import { remove, cloneDeep, initial } from 'lodash-es'

import { arrayMove } from '@dnd-kit/sortable'

import type { UniqueIdentifier, Active, Over } from '@dnd-kit/core'
import type { SortableData } from '@dnd-kit/sortable'
import type { DirTree } from '@/types'

type Data = SortableData & {
	parent_index: Array<number>
	item: ItemWithChildren
}

type Item = {
	id: UniqueIdentifier
} & DirTree.Item

type ItemWithChildren = {
	id: UniqueIdentifier
	children: Array<ItemWithChildren>
}

export default (items: DirTree.Items, active: Active, over: Over | null) => {
	console.log(active, over)

	if (!over?.id) return false

	const { parent_index: active_parent_index, item: active_item } = active.data.current as Data
	const { parent_index: over_parent_index, item: over_item } = over.data.current as Data

	const active_index = active_parent_index.pop()
	const over_index = over_parent_index.pop()

	if (active_parent_index.join(',') === over_parent_index.join(',')) {
		if (active_parent_index.length > 0) {
			active_parent_index.reduce((total: Array<ItemWithChildren>, index, idx) => {
				const children = total[index].children

				if (idx === active_parent_index.length - 1) {
					total[index].children = arrayMove(children, active_index, over_index)

					return total
				} else {
					return children
				}
                  }, items as Array<any>)
                  
                  console.log(items);

			return items
		} else {
			return arrayMove(
				items,
				items.findIndex((item) => item.id === active.id),
				items.findIndex((item) => item.id === over.id)
			)
		}
	}

	return items
}
