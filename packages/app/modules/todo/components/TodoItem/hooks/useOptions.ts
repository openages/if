import dayjs from 'dayjs'
import { useLayoutEffect, useMemo } from 'react'

import type { MutableRefObject } from 'react'
import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	input: MutableRefObject<HTMLDivElement>
	zen_mode: IPropsTodoItem['zen_mode']
}

export default (args: HookArgs) => {
	const { item, input, zen_mode } = args
	const { remind_time, children } = item

	const remind = useMemo(
		() => zen_mode && remind_time && dayjs(remind_time).diff(dayjs(), 'hour') <= 12,
		[zen_mode, remind_time]
	)

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !children || !children?.length) return el.removeAttribute('data-children')

		const checked_children = children.filter(item => item?.status === 'checked')

		el.setAttribute('data-children', `${checked_children.length}/${children.length}`)
	}, [children])

	useLayoutEffect(() => {
		const el = input.current

		if (!el || !remind) return el.removeAttribute('data-remind')

		el.setAttribute('data-remind', dayjs().to(dayjs(remind_time)))
	}, [remind])

	return { remind }
}
