import { useMemoizedFn } from 'ahooks'

import { id as genID } from '@/utils'

import type { Todo } from '@/types'
import type { ChangeEvent } from 'react'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	index: IPropsTodoItem['index']
	visible_detail_modal?: boolean
	makeLinkLine?: IPropsTodoItem['makeLinkLine']
	check?: IPropsTodoItem['check']
	insert?: IPropsTodoItem['insert']
	update: IPropsTodoItem['update']
	tab?: IPropsTodoItem['tab']
}

export default (args: HookArgs) => {
	const { item, index, visible_detail_modal, makeLinkLine, check, insert, update, tab } = args
	const { id, status, open, star, cycle_enabled, cycle, options_width, children } = item

	const setOpen = useMemoizedFn((v: boolean) => {
		update({ type: 'parent', index, value: { open: v } as Todo.Todo })
	})

	const onCheck = useMemoizedFn(() => {
		if (status === 'closed') return

		check({ id, status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const onDrag = useMemoizedFn(({ clientY }) => {
		if (status !== 'unchecked') return

		makeLinkLine({ active_id: id, y: clientY })
	})

	const toggleChildren = useMemoizedFn(() => {
		if (!children?.length) return

		setOpen(!open)
	})

	const insertChildren = useMemoizedFn(async (children_index?: number) => {
		const children = [...(item.children || [])]
		const target = { id: genID(), text: '', status: 'unchecked' } as const

		if (children_index === undefined) {
			children.push(target)
		} else {
			children.splice(children_index + 1, 0, target)
		}

		await update({ type: 'children', index, value: children })

		setTimeout(
			() => document.getElementById(`${visible_detail_modal ? 'detail_' : ''}todo_${target.id}`)?.focus(),
			0
		)
	})

	const removeChildren = useMemoizedFn(async (children_index: number) => {
		const children = [...(item.children || [])]

		children.splice(children_index, 1)

		await update({ type: 'children', index, value: children })
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insert({ index })
		}

		if (e.key === 'Tab') {
			e.preventDefault()

			tab({ type: 'in', index })
		}
	})

	const updateTags = useMemoizedFn(v => {
		if (v?.length > 3) return

		update({ type: 'parent', index, value: { tag_ids: v } as Todo.Todo })
	})

	const updateTagWidth = useMemoizedFn(v => {
		if (v === options_width) return

		update({ type: 'parent', index, value: { options_width: v } as Todo.Todo })
	})

	const updateStar = useMemoizedFn(v => {
		update({ type: 'parent', index, value: { star: v } as Todo.Todo })
	})

	const updateRemind = useMemoizedFn(v => {
		update({ type: 'parent', index, value: { remind_time: v } as Todo.Todo })
	})

	const updateCircle = useMemoizedFn(v => {
		update({ type: 'parent', index, value: { ...v } as Todo.Todo })
	})

	const updateRemark = useMemoizedFn(({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
		update({ type: 'parent', index, value: { remark: value } as Todo.Todo })
	})

	return {
		setOpen,
		onCheck,
		onDrag,
		toggleChildren,
		insertChildren,
		removeChildren,
		onKeyDown,
		updateTags,
		updateTagWidth,
		updateStar,
		updateRemind,
		updateCircle,
		updateRemark
	}
}
