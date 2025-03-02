import { useCreateLayoutEffect } from '@/hooks'

import type { RefObject } from 'react'
import type { IPropsTodoItem } from '../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	input: RefObject<HTMLDivElement | null>
}

export default (args: HookArgs) => {
	const { item, input } = args
	const { children } = item

	useCreateLayoutEffect(() => {
		const el = input.current!

		if (!el || !children || !children?.length) {
			el.removeAttribute('data-children')

			return
		}

		const checked_children = children.filter(item => item?.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])
}
