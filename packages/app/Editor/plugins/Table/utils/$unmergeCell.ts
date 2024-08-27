import { $getSelection, $isRangeSelection } from 'lexical'

import { $computeTableMap, $createTableCellNode, $getNodeTriplet, $insertFirst, $isTableSelection } from './index'

import type TableSelection from '../TableSelection'
import type TableRowNode from '../TableRowNode'

export default () => {
	const selection = $getSelection() as TableSelection

	if (!$isRangeSelection(selection) && !$isTableSelection(selection)) return

	const anchor = selection.anchor.getNode()
	const [cell, row, grid] = $getNodeTriplet(anchor)
	const col_span = cell.__col_span
	const row_span = cell.__row_span

	if (col_span > 1) {
		for (let i = 1; i < col_span; i++) {
			cell.insertAfter($createTableCellNode({}))
		}

		cell.setColSpan(1)
	}

	if (row_span > 1) {
		const [map, cell_map] = $computeTableMap(grid, cell, cell)
		const { start_column, start_row } = cell_map

		let current_row_node: TableRowNode

		for (let i = 1; i < row_span; i++) {
			const current_row = start_row + i
			const current_row_map = map[current_row]

			current_row_node = (current_row_node! || row).getNextSibling()!

			let insert_after_cell = null

			for (let column = 0; column < start_column; column++) {
				const current_cell_map = current_row_map[column]
				const current_cell = current_cell_map.cell

				if (current_cell_map.start_row === current_row) {
					insert_after_cell = current_cell
				}

				if (current_cell.__col_span > 1) {
					column += current_cell.__col_span - 1
				}
			}
			if (insert_after_cell === null) {
				for (let j = 0; j < col_span; j++) {
					$insertFirst(current_row_node, $createTableCellNode({}))
				}
			} else {
				for (let j = 0; j < col_span; j++) {
					insert_after_cell.insertAfter($createTableCellNode({}))
				}
			}
		}

		cell.setRowSpan(1)
	}
}
