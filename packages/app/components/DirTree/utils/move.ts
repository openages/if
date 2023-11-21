import { arrayMove } from '@dnd-kit/sortable'

import type { UniqueIdentifier, Active, Over } from '@dnd-kit/core'
import type { SortableData } from '@dnd-kit/sortable'
import type { DirTree } from '@/types'

type Data = SortableData & {
	parent_index: Array<number>
	item: DirTree.Item
}

type Item = {
	id: UniqueIdentifier
} & DirTree.Item

export default (items: DirTree.Items, active: Active, over: Over | null) => {
	if (!over?.id) return false
	if (active.id === over.id) return false

	const { parent_index: active_parent_index, item: active_item } = active.data.current as Data
	const { parent_index: over_parent_index, item: over_item } = over.data.current as Data

	const active_index = active_parent_index.pop()
	const over_index = over_parent_index.pop()

	const takeActiveItem = () => {
		if (active_parent_index.length > 0) {
			active_parent_index.reduce((total: DirTree.Items, index, idx) => {
				const children = (total[index] as DirTree.Item).children

				if (idx === active_parent_index.length - 1) {
					children.splice(active_index, 1)

					return total
				} else {
					return children
				}
			}, items as Array<any>)
		} else {
			items.splice(active_index, 1)
		}
	}

	if (over_item.type === 'dir') {
		if (over_parent_index.length > 0) {
			over_parent_index.reduce((total: DirTree.Items, index, idx) => {
				const children = (total[index] as DirTree.Item).children

				if (idx === over_parent_index.length - 1) {
					;(children[over_index] as DirTree.Item).children.push(active_item)

					return total
				} else {
					return children
				}
			}, items as Array<any>)
            } else {
			;(items[over_index] as DirTree.Item).children.push(active_item)
		}

		takeActiveItem()
	} else {
		if (active_parent_index.join(',') === over_parent_index.join(',')) {
			if (active_parent_index.length > 0) {
				active_parent_index.reduce((total: DirTree.Items, index, idx) => {
					const children = (total[index] as DirTree.Item).children

					if (idx === active_parent_index.length - 1) {
						;(total[index] as DirTree.Item).children = arrayMove(
							children,
							active_index,
							over_index
						)

						return total
					} else {
						return children
					}
				}, items as Array<any>)

				return items
			} else {
				return arrayMove(
					items,
					items.findIndex((item) => item.id === active.id),
					items.findIndex((item) => item.id === over.id)
				)
			}
		} else {
			takeActiveItem()

			if (over_parent_index.length > 0) {
				over_parent_index.reduce((total: DirTree.Items, index, idx) => {
					const children = (total[index] as DirTree.Item).children

					if (idx === over_parent_index.length - 1) {
						children.splice(over_index + 1, 0, active_item)

						return total
					} else {
						return children
					}
				}, items as Array<any>)
			} else {
				items.splice(over_index + 1, 0, active_item)
			}
		}
	}

	return items
}
