import { useMemoizedFn } from 'ahooks'

import Item from './Item'

import type { IPropsDirItem_File, IPropsDirItem_Item } from '../../../types'

const Index = (props: IPropsDirItem_File) => {
	const { module, item, current_item, parent_index = [], onClick, showDirTreeOptions } = props

	const props_item: IPropsDirItem_Item = {
		module,
		item,
		current_item,
		parent_index,
		showDirTreeOptions,
		onItem: onClick
	}

	return <Item {...props_item}></Item>
}

export default $app.memo(Index)
