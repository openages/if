import { stopEvent } from '@/Editor/utils'
import { $findMatchingParent } from '@lexical/utils'

import { $computeTableMap, $getExitingToNode, $isTableCellNode, $isTableNode, isExitingCell } from './index'

import type { LexicalNode } from 'lexical'
import type TableNode from '../TableNode'
import type TableCellNode from '../TableCellNode'

export default (
	event: KeyboardEvent,
	anchor_node: LexicalNode,
	table_node: TableNode,
	direction: 'backward' | 'forward'
) => {
	const anchor_cell_node = $findMatchingParent(anchor_node, $isTableCellNode) as TableCellNode

	if (!$isTableCellNode(anchor_cell_node)) return false

	const [table_map, cell_value] = $computeTableMap(table_node, anchor_cell_node, anchor_cell_node)

	if (!isExitingCell(table_map, cell_value, direction)) return false

	const to_node = $getExitingToNode(anchor_node, direction, table_node)

	if (!to_node || $isTableNode(to_node)) return false

	stopEvent(event)

	if (direction === 'backward') {
		to_node.selectEnd()
	} else {
		to_node.selectStart()
	}

	return true
}
