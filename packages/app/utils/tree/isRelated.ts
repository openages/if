import { deepEqual } from '@openages/craftkit'

import type { UniqueIdentifier, Active, Over } from '@dnd-kit/core'

type ItemWithChildren = {
	id: UniqueIdentifier
	children: Array<ItemWithChildren>
}

export default (active: Active | null, over: Over | null) => {
	if (!over?.id || !active?.id) return false

	const active_item = active.data.current!.item as ItemWithChildren
	const over_item = over.data.current!.item as ItemWithChildren

	if (deepEqual(active_item, over_item)) return true

	if (over_item.children) {
		return over_item.children.findIndex((item) => item.id === active.id) !== -1
	}

	if (active_item.children) {
		return active_item.children.findIndex((item) => item.id === over.id) !== -1
	}

	return false
}
