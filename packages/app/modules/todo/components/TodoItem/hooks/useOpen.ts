import { useUpdateEffect } from 'ahooks'
import { useEffect, useLayoutEffect } from 'react'

import type { MutableRefObject } from 'react'
import type { IPropsTodoItem } from '../../../types'

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

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return

		const checked_children = children.filter(item => item.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])

	useEffect(() => {
		if (isDragging) setOpen(false)
	}, [isDragging])

	useUpdateEffect(() => renderLines(id), [open])
}
