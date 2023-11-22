import { arrayMove } from '@dnd-kit/sortable'

import type { Active, Over } from '@dnd-kit/core'
import type { SortableData } from '@dnd-kit/sortable'
import type { DirTree } from '@/types'

type Data = SortableData & {
	parent_index: Array<number>
	item: DirTree.Item
}

export default (items: DirTree.Items, active: Active, over: Over | null) => {
	if (!over?.id) return false
	if (active.id === over.id) return false

	const { parent_index: active_parent_index, item: active_item } = active.data.current as Data
	const { parent_index: over_parent_index, item: over_item } = over.data.current as Data

	const active_index = active_parent_index.pop()
	const over_index = over_parent_index.pop()

	let active_children = [] as Array<DirTree.TransformedItem>
	let over_children = [] as Array<DirTree.TransformedItem>

	const takeActiveItem = () => {
		if (active_parent_index.length > 0) {
			active_parent_index.reduce((total: DirTree.Items, index, idx) => {
				const children = (total[index] as DirTree.TransformedItem).children

				if (idx === active_parent_index.length - 1) {
					children.splice(active_index, 1)

					active_children = children

					return total
				} else {
					return children
				}
			}, items)
		} else {
			items.splice(active_index, 1)

			active_children = items
		}
	}

	if (over_item.type === 'dir') {
		if (over_parent_index.length > 0) {
			over_parent_index.reduce((total: DirTree.Items, index, idx) => {
				const target_dir = total[index] as DirTree.TransformedItem
				const children = target_dir.children

				if (idx === over_parent_index.length - 1) {
					active_item.pid = target_dir.id

					target_dir.children.push(active_item)

					over_children = target_dir.children

					return total
				} else {
					return children
				}
			}, items)
		} else {
			const target_dir = items[over_index] as DirTree.TransformedItem

			active_item.pid = target_dir.id

			target_dir.children.push(active_item)

			over_children = target_dir.children
		}

		takeActiveItem()
	} else {
		if (active_parent_index.join(',') === over_parent_index.join(',')) {
			if (active_parent_index.length > 0) {
				active_parent_index.reduce((total: DirTree.Items, index, idx) => {
					const target_dir = total[index] as DirTree.TransformedItem
					const children = target_dir.children

					if (idx === active_parent_index.length - 1) {
						target_dir.children = arrayMove(children, active_index, over_index)

						active_children = target_dir.children

						return total
					} else {
						return children
					}
				}, items)
			} else {
				items = arrayMove(
					items,
					items.findIndex((item) => item.id === active.id),
					items.findIndex((item) => item.id === over.id)
				)

				active_children = items
			}
		} else {
			takeActiveItem()

			if (over_parent_index.length > 0) {
				over_parent_index.reduce((total: DirTree.Items, index, idx) => {
					const target_dir = total[index] as DirTree.TransformedItem
					const children = target_dir.children

					if (idx === over_parent_index.length - 1) {
						active_item.pid = target_dir.pid

						children.splice(over_index + 1, 0, active_item)

						over_children = children

						return total
					} else {
						return children
					}
				}, items)
			} else {
				active_item.pid = undefined

				items.splice(over_index + 1, 0, active_item)

				over_children = items
			}
		}
	}

	return { items, active_children, over_children }
}
