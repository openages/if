import type TableNode from '../TableNode'

export default (table_node: TableNode, index_to_delete: number): TableNode => {
	const table_rows = table_node.getChildren()
	const target_row_node = table_rows[index_to_delete]

	target_row_node.remove()

	return table_node
}
