import { useMemo } from 'react'

import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
}

export default (args: HookArgs) => {
	const { item } = args
	const { tag_ids, tag_width } = item

	const target_tag_width = useMemo(() => {
		if (tag_ids?.length) {
			return tag_width ? tag_width - 2 : 'unset'
		} else {
			return 'unset'
		}
	}, [tag_ids, tag_width])

	return { target_tag_width }
}
