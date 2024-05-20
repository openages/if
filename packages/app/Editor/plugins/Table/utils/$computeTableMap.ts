import type TableNode from '../TableNode'
import type TableCellNode from '../TableCellNode'
import type TableRowNode from '../TableRowNode'
import type { TableMap, TableMapValue } from '../types'

export default (
	table: TableNode,
	cell_a: TableCellNode,
	cell_b: TableCellNode
): [TableMap, TableMapValue, TableMapValue] => {
	const table_map: TableMap = []

	let cell_a_value: TableMapValue = null
	let cell_b_value: TableMapValue = null

	function write(start_row: number, start_column: number, cell: TableCellNode) {
		const value = { cell, start_row, start_column } as TableMapValue
		const row_span = cell.__row_span
		const col_span = cell.__col_span

		for (let i = 0; i < row_span; i++) {
			if (table_map[start_row + i] === undefined) table_map[start_row + i] = []

			for (let j = 0; j < col_span; j++) {
				table_map[start_row + i][start_column + j] = value
			}
		}

		if (cell_a !== null && cell_a.is(cell)) cell_a_value = value
		if (cell_b !== null && cell_b.is(cell)) cell_b_value = value
	}

	function is_empty(row: number, column: number) {
		return table_map[row] === undefined || table_map[row][column] === undefined
	}

	const table_children = table.getChildren()

	for (let i = 0; i < table_children.length; i++) {
		const row = table_children[i] as TableRowNode
		const row_children = row.getChildren()

		let j = 0

		for (const cell of row_children) {
			while (is_empty(i, j)) {
				j++
			}

			write(i, j, cell as TableCellNode)

			j += (cell as TableCellNode).__col_span
		}
	}

	return [table_map, cell_a_value, cell_b_value]
}
