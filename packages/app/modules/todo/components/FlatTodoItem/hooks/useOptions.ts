import { useLayoutEffect } from 'react'

import type { RefObject } from 'react'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	input: RefObject<HTMLDivElement | null>
	zen_mode: IPropsTodoItem['zen_mode']
}

export default (args: HookArgs) => {
	const { item, input } = args
	const { children } = item

	useLayoutEffect(() => {
		const el = input.current!

		if (!el || !children || !children?.length) {
			el.removeAttribute('data-children')

			return
		}

		const checked_children = children.filter(item => item?.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])
}
