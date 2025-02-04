import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import type { Todo } from '@/types'
import type { IPropsTodoItem } from '../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	index: IPropsTodoItem['index']
	dimension_id?: IPropsTodoItem['dimension_id']
	makeLinkLine?: IPropsTodoItem['makeLinkLine']
	check?: IPropsTodoItem['check']
	insert?: IPropsTodoItem['insert']
	update: IPropsTodoItem['update']
	tab?: IPropsTodoItem['tab']
	handleOpenItem?: IPropsTodoItem['handleOpenItem']
}

export default (args: HookArgs) => {
	const { item, index, dimension_id, makeLinkLine, check, insert, update, tab, handleOpenItem } = args
	const { id, status, schedule, children } = item
	const [open, _setOpen] = useState(false)

	const updateValues = useMemoizedFn(v => {
		update({ type: 'parent', index, dimension_id, value: { ...v } as Todo.Todo })
	})

	const setOpen = useMemoizedFn((v: boolean) => {
		_setOpen(v)
		handleOpenItem!(id, v)
	})

	const onCheck = useMemoizedFn(() => {
		if (status === 'closed') return

		check!({ index, dimension_id, status: status === 'unchecked' ? 'checked' : 'unchecked' })
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

		makeLinkLine!({ active_id: id, y: clientY })
	})

	const toggleChildren = useMemoizedFn(() => {
		if (!children?.length) return

		setOpen(!open)
	})

	const insertChildren = useMemoizedFn(async (children_index?: number) => {
		await update({ type: 'insert_children_item', index, children_index, dimension_id, value: {} })
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insert!({ index, dimension_id })
		}

		if (e.key === 'Tab') {
			e.preventDefault()

			tab!({ type: 'in', index, dimension_id })
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
		onKeyDown
	}
}
