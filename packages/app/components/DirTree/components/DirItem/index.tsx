import { match } from 'ts-pattern'

import { Dir, File, SortableWrap } from './components'

import type { IPropsDirItem } from '../../types'

const Index = (props: IPropsDirItem) => {
	return (
		<SortableWrap id={props.item.id}>
			{match(props.item.type)
				.with('file', () => <File {...props}></File>)
				.with('dir', () => <Dir {...props}></Dir>)
				.exhaustive()}
		</SortableWrap>
	)
}

export default $app.memo(Index)
