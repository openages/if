import { useUpdateEffect } from 'ahooks'
import { useLayoutEffect } from 'react'

import type { MutableRefObject } from 'react'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	input: MutableRefObject<HTMLDivElement>
	renderLines: IPropsTodoItem['renderLines']
}

export default (args: HookArgs) => {
	const { item, input, renderLines } = args
	const { id, children, open } = item

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return

		const checked_children = children.filter(item => item.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])

	useUpdateEffect(() => renderLines(id), [open])
}
