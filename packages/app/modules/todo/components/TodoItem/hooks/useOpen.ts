import { useUpdateEffect, usePrevious } from 'ahooks'
import { useLayoutEffect, useEffect } from 'react'

import { deepEqual } from '@openages/stk'

import type { IPropsTodoItem } from '../../../types'
import type { MutableRefObject } from 'react'

interface HookArgs {
	item: IPropsTodoItem['item']
	input: MutableRefObject<HTMLDivElement>
	isDragging: boolean
	renderLines: IPropsTodoItem['renderLines']
	setOpen: (v: boolean) => void
}

export default (args: HookArgs) => {
	const { item, input, isDragging, renderLines, setOpen } = args
	const { id, children, open } = item
	const prev_children = usePrevious(children)

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return

		const checked_children = children.filter((item) => item.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])

	useUpdateEffect(() => {
		if (deepEqual(children, prev_children)) return

		setOpen(children?.length > 0)
	}, [children, prev_children])

	useEffect(() => {
		if (isDragging) setOpen(false)
	}, [isDragging])

	useUpdateEffect(() => renderLines(id), [open])
}
