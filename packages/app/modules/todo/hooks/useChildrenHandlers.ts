import { useMemoizedFn } from 'ahooks'

import { id as genID } from '@/utils'

import type { Todo } from '@/types'
import type Model from '../model'

interface Args {
	file_id: Todo.Todo['file_id']
	items: Todo.Todo['children']
	index: number
	dimension_id: string
	update: Model['update']
}

export default (args: Args) => {
	const { file_id, items, index, dimension_id, update } = args

	const insertChildren = useMemoizedFn(async (children_index?: number) => {
		const children = [...(items || [])]
		const target = { id: genID(), text: '', status: 'unchecked' } as const

		if (children_index === undefined) {
			children.push(target)
		} else {
			children.splice(children_index + 1, 0, target)
		}

		await update({ type: 'children', index, dimension_id, value: children })

		const visible_detail_modal = await window.$app.Event.emit(`todo/${file_id}/getVisibleDetailModal`)

		setTimeout(
			() => document.getElementById(`${visible_detail_modal ? 'detail_' : ''}todo_${target.id}`)?.focus(),
			0
		)
	})

	const removeChildren = useMemoizedFn(async (children_index: number) => {
		const children = [...(items || [])]

		children.splice(children_index, 1)

		await update({ type: 'children', index, dimension_id, value: children })
	})

	return { insertChildren, removeChildren }
}
