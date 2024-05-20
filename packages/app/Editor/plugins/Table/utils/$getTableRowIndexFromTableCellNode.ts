import { $findRowNode, $findTableNode } from './index'

import type TableCellNode from '../TableCellNode'

export default (table_cell_node: TableCellNode) => {
	const table_row_node = $findRowNode(table_cell_node)
	const table_node = $findTableNode(table_row_node)

	return table_node.getChildren().findIndex(n => n.is(table_row_node))
}
