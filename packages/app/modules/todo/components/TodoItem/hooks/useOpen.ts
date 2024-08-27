import { useUpdateEffect } from 'ahooks'

import { useDeepEffect } from '@/hooks'

import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	zen_mode: IPropsTodoItem['zen_mode']
	open: boolean
	open_items: IPropsTodoItem['open_items']
	renderLines: IPropsTodoItem['renderLines']
	setOpen: (v: boolean) => void
}

export default (args: HookArgs) => {
	const { item, zen_mode, open, open_items, renderLines, setOpen } = args
	const { id } = item

	useUpdateEffect(() => renderLines!(id), [open, zen_mode])

	useDeepEffect(() => {
		if (!open_items) return

		if (open_items.includes(id)) {
			setOpen(true)
		}
	}, [open_items, id])
}
