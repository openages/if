import { $findMatchingParent } from '@lexical/utils'

import { $isTableCellNode } from './index'

import type { LexicalNode } from 'lexical'
import type TableCellNode from '../TableCellNode'

export default (node: LexicalNode) => {
	const cell_node = $findMatchingParent(node, $isTableCellNode)

	return ($isTableCellNode(cell_node) ? cell_node : null) as TableCellNode
}
