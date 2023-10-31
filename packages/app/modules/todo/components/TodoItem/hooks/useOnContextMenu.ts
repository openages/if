import { useMemoizedFn } from 'ahooks'

import type { IPropsTodoItem } from '../../../types'
import type { Todo } from '@/types'

interface HookArgs {
	item: IPropsTodoItem['item']
	index: IPropsTodoItem['index']
	update: IPropsTodoItem['update']
	moveTo: IPropsTodoItem['moveTo']
	insert: IPropsTodoItem['insert']
	tab: IPropsTodoItem['tab']
	remove: IPropsTodoItem['remove']
	showDetailModal: IPropsTodoItem['showDetailModal']
	insertChildren: (children_index?: number) => Promise<void>
}

export default (args: HookArgs) => {
	const { item, index, update, moveTo, insert, tab, remove, showDetailModal, insertChildren } = args
	const { id, tag_ids } = item

	const onContextMenu = useMemoizedFn(({ key, keyPath }) => {
		if (keyPath.length > 1) {
			const parent_key = keyPath.at(-1)
			const target_id = keyPath.at(0)

			switch (parent_key) {
				case 'add_tags':
					let target = [] as Array<string>

					if (tag_ids?.length) {
						if (tag_ids.includes(target_id)) {
							target = tag_ids.filter((item) => item !== target_id)
						} else {
							target = [...tag_ids, target_id]
						}
					} else {
						target.push(target_id)
					}

					update({
						type: 'parent',
						index,
						value: { tag_ids: target } as Todo.Todo
					})

					break
				case 'move':
					moveTo(id, target_id)
					break
			}
		} else {
			switch (key) {
				case 'detail':
					showDetailModal(index)
					break
				case 'insert':
					insert({ index })
					break
				case 'insert_children':
					insertChildren()
					break
				case 'move_into':
					tab({ type: 'in', index })
					break
				case 'remove':
					remove(id)
					break
			}
		}
	})

	return { onContextMenu }
}
