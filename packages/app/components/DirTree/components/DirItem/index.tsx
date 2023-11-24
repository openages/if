import { match } from 'ts-pattern'

import { Dir, File, SortableWrap } from './components'

import type { IPropsDirItem } from '../../types'

const Index = (props: IPropsDirItem) => {
	const { parent_index, item } = props

	return (
		<SortableWrap item={item} parent_index={parent_index}>
			{match(props.item.type)
				.with('file', () => <File {...props} item={item}></File>)
				.with('dir', () => <Dir {...props} item={item}></Dir>)
				.exhaustive()}
		</SortableWrap>
	)
}

export default $app.memo(Index)
