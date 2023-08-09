import { match } from 'ts-pattern'

import { Dir, File, SortableWrap } from './components'

import type { IPropsDirItem } from '../../types'

const Index = (props: IPropsDirItem) => {
	const { item, parent_index } = props

	return (
		<SortableWrap item={item} parent_index={parent_index}>
			{match(props.item.type)
				.with('file', () => <File {...props}></File>)
				.with('dir', () => <Dir {...props}></Dir>)
				.exhaustive()}
		</SortableWrap>
	)
}

export default $app.memo(Index)
