import { useUpdateEffect } from 'ahooks'
import { useLayoutEffect } from 'react'

import { useDeepEffect } from '@/hooks'

import type { MutableRefObject } from 'react'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	zen_mode: IPropsTodoItem['zen_mode']
	open: boolean
	open_items: IPropsTodoItem['open_items']
	input: MutableRefObject<HTMLDivElement>
	renderLines: IPropsTodoItem['renderLines']
	setOpen: (v: boolean) => void
}

export default (args: HookArgs) => {
	const { item, zen_mode, open, open_items, input, renderLines, setOpen } = args
	const { id, children } = item

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return

		const checked_children = children.filter(item => item.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])

	useUpdateEffect(() => renderLines(id), [open, zen_mode])

	useDeepEffect(() => {
		if (open_items.includes(id)) {
			setOpen(true)
		}
	}, [open_items, id])
}
