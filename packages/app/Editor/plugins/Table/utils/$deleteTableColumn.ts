import { $isTableRowNode } from './index'

import type TableRowNode from '../TableRowNode'
import type TableNode from '../TableNode'

export default (table_node: TableNode, target_index: number) => {
	const table_rows = table_node.getChildren()

	for (let i = 0; i < table_rows.length; i++) {
		const current_table_row_node = table_rows[i] as TableRowNode

		if ($isTableRowNode(current_table_row_node)) {
			const table_row_children = current_table_row_node.getChildren()

			table_row_children[target_index].remove()
		}
	}

	return table_node
}
