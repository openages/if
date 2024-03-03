import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import { id as genID } from '@/utils'

import type { Todo } from '@/types'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	index: IPropsTodoItem['index']
	kanban_mode: IPropsTodoItem['kanban_mode']
	dimension_id?: IPropsTodoItem['dimension_id']
	visible_detail_modal?: boolean
	makeLinkLine?: IPropsTodoItem['makeLinkLine']
	check?: IPropsTodoItem['check']
	insert?: IPropsTodoItem['insert']
	update: IPropsTodoItem['update']
	tab?: IPropsTodoItem['tab']
	handleOpenItem?: IPropsTodoItem['handleOpenItem']
}

export default (args: HookArgs) => {
	const {
		item,
		index,
		kanban_mode,
		dimension_id,
		visible_detail_modal,
		makeLinkLine,
		check,
		insert,
		update,
		tab,
		handleOpenItem
	} = args
	const { id, status, schedule, children } = item
	const [open, _setOpen] = useState(false)

	const updateValues = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { ...v } as Todo.Todo })
	})

	const setOpen = useMemoizedFn((v: boolean) => {
		_setOpen(v)
		handleOpenItem(id, v)
	})

	const onCheck = useMemoizedFn(() => {
		if (status === 'closed') return

		check({ index, dimension_id, status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const updateTags = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { tag_ids: v } as Todo.Todo })
	})

	const updateLevel = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { level: v } as Todo.Todo })
	})

	const updateRemind = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { remind_time: v } as Todo.Todo })
	})

	const updateDeadline = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { end_time: v } as Todo.Todo })
	})

	const updateCycle = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { cycle: v } as Todo.Todo })
	})

	const updateSchedule = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { schedule: !schedule } as Todo.Todo })
	})

	const updateRemark = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { remark: v } as Todo.Todo })
	})

	const onDrag = useMemoizedFn(({ clientY }) => {
		if (status !== 'unchecked') return
		if (kanban_mode === 'tag') return

		makeLinkLine({ active_id: id, y: clientY })
	})

	const insertChildren = useMemoizedFn(async (children_index?: number) => {
		const children = [...(item.children || [])]
		const target = { id: genID(), text: '', status: 'unchecked' } as const

		if (children_index === undefined) {
			children.push(target)
		} else {
			children.splice(children_index + 1, 0, target)
		}

		await update({ type: 'children', index, dimension_id, value: children })

		setTimeout(
			() => document.getElementById(`${visible_detail_modal ? 'detail_' : ''}todo_${target.id}`)?.focus(),
			0
		)
	})

	const removeChildren = useMemoizedFn(async (children_index: number) => {
		const children = [...(item.children || [])]

		children.splice(children_index, 1)

		await update({ type: 'children', index, dimension_id, value: children })
	})

	const toggleChildren = useMemoizedFn(() => {
		if (!children?.length) return

		setOpen(!open)
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insert({ index, dimension_id })
		}

		if (kanban_mode === 'tag') return

		if (e.key === 'Tab') {
			e.preventDefault()

			tab({ type: 'in', index, dimension_id })
		}
	})

	return {
		open,
		setOpen,
		onCheck,
		updateValues,
		updateTags,
		updateLevel,
		updateRemind,
		updateDeadline,
		updateCycle,
		updateSchedule,
		updateRemark,
		onDrag,
		toggleChildren,
		insertChildren,
		removeChildren,
		onKeyDown
	}
}
