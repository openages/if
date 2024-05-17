import { $applyNodeReplacement } from 'lexical'

import TableCellNode from '../TableCellNode'

import type { IPropsTableCellNode } from '../types'

export default (props: IPropsTableCellNode) => {
	return $applyNodeReplacement(new TableCellNode(props)) as TableCellNode
}
