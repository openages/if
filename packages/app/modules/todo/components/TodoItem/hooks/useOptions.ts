import { useLayoutEffect } from 'react'

import type { MutableRefObject } from 'react'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	input: MutableRefObject<HTMLDivElement>
	zen_mode: IPropsTodoItem['zen_mode']
}

export default (args: HookArgs) => {
	const { item, input } = args
	const { children } = item

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return el.removeAttribute('data-children')

		const checked_children = children.filter(item => item?.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])
}
