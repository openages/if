import { useMemoizedFn } from 'ahooks'

import type { Todo } from '@/types'
import type { IPropsTodoItem } from '../../../types'

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
			const target_key = keyPath.at(0)

			switch (parent_key) {
				case 'add_tags':
					let target = [] as Array<string>

					if (tag_ids?.length) {
						if (tag_ids.includes(target_key)) {
							target = tag_ids.filter(item => item !== target_key)
						} else {
							target = [...tag_ids, target_key]
						}
					} else {
						target.push(target_key)
					}

					update({
						type: 'parent',
						index,
						value: { tag_ids: target } as Todo.Todo
					})

					break
				case 'move':
					moveTo(id, target_key)
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
