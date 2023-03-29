import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'
import { match } from 'ts-pattern'

import { Dir, File, SortableWrap } from './components'

import type { IPropsDirItem } from '../../types'

const Index = (props: IPropsDirItem) => {
	const { item, parent_index = [], open: default_open, setFoldAll } = props
	const [open, setOpen] = useState(() => default_open)

	const _onItem = useMemoizedFn(() => {
		setOpen(!open)

		if (!open) setFoldAll(false)
	})

	const _setOpen = useMemoizedFn(setOpen)

	return (
		<SortableWrap id={item.id} item={item} parent_index={parent_index} open={open}>
			{match(props.item.type)
				.with('file', () => <File {...props}></File>)
				.with('dir', () => <Dir {...props} open={open!} onItem={_onItem} setOpen={_setOpen}></Dir>)
				.exhaustive()}
		</SortableWrap>
	)
}

export default $app.memo(Index)
