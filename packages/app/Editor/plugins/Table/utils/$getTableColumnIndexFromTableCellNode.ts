import { $findRowNode } from './index'

import type TableCellNode from '../TableCellNode'

export default (table_cell_node: TableCellNode) => {
	const tableRowNode = $findRowNode(table_cell_node)

	return tableRowNode.getChildren().findIndex(n => n.is(table_cell_node))
}
