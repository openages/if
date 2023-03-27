import { remove } from 'lodash-es'

import { arrayMove } from '@dnd-kit/sortable'

import isRelated from './isRelated'

import type { UniqueIdentifier, Active, Over } from '@dnd-kit/core'
import type { SortableData } from '@dnd-kit/sortable'

type Data = SortableData & {
	parent_index: Array<number>
	item: ItemWithChildren
	parent: Array<ItemWithChildren>
}

type Item = {
	id: UniqueIdentifier
}

type ItemWithChildren = {
	id: UniqueIdentifier
	children: Array<ItemWithChildren>
}

export default <T>(items: Array<T & Item>, active: Active, over: Over | null) => {
	if (!over?.id) return items
	if (isRelated(active, over)) return items

	const active_data = active.data.current as Data
	const over_data = over.data.current as Data

	if (active_data.sortable.containerId === over_data.sortable.containerId) {
		if (active_data.parent_index.length > 0) {
			active_data.parent_index.reduce((total: Array<ItemWithChildren>, index, idx) => {
				const children = total[index].children

				if (idx === active_data.parent_index.length - 1) {
					total[index].children = arrayMove(
						children,
						children.findIndex((item) => item.id === active.id),
						children.findIndex((item) => item.id === over.id)
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
		const getActiveItem = (): any => {
			if (active_data.parent_index.length) {
				return active_data.parent_index.reduce((total: Array<ItemWithChildren>, index, idx) => {
					const children = total[index].children

					if (idx === active_data.parent_index.length - 1) {
						return remove(children, (item) => item.id === active.id)
					} else {
						return children
					}
				}, items as Array<any>)[0]
			} else {
				return remove(items, (item) => item.id === active.id)[0]
			}
		}

            const over_index = over_data.parent.findIndex((item) => item.id === over.id)

		if (over_data.parent_index.length) {
			over_data.parent_index.reduce((total: Array<ItemWithChildren>, index, idx) => {
				const children = total[index].children

				if (idx === over_data.parent_index.length - 1) {
					children.splice(over_index, 0, getActiveItem())

					return total
				} else {
					return children
				}
			}, items as Array<any>)
		} else {
			items.splice(over_index, 0, getActiveItem())
		}
	}

	return items
}
