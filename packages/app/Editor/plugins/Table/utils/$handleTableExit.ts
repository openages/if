import { stopEvent } from '@/Editor/utils'
import { $findMatchingParent } from '@lexical/utils'

import { $isTableCellNode, $isTableNode } from './index'

import type { LexicalNode } from 'lexical'
import type TableNode from '../TableNode'

export default (
	event: KeyboardEvent,
	anchorNode: LexicalNode,
	tableNode: TableNode,
	direction: 'backward' | 'forward'
) => {
	const anchorCellNode = $findMatchingParent(anchorNode, $isTableCellNode)

	if (!$isTableCellNode(anchorCellNode)) return false

	const [tableMap, cellValue] = $computeTableMap(tableNode, anchorCellNode, anchorCellNode)

	if (!isExitingCell(tableMap, cellValue, direction)) return false

	const toNode = $getExitingToNode(anchorNode, direction, tableNode)

	if (!toNode || $isTableNode(toNode)) return false

	stopEvent(event)

	if (direction === 'backward') {
		toNode.selectEnd()
	} else {
		toNode.selectStart()
	}

	return true
}
