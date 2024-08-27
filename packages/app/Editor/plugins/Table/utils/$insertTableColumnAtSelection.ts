import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical'

import {
	$computeTableMap,
	$createTableCellNode,
	$getNodeTriplet,
	$insertFirst,
	$isTableSelection,
	$moveSelectionToCell
} from './index'

import type TableRowNode from '../TableRowNode'
import type TableSelection from '../TableSelection'
import type TableCellNode from '../TableCellNode'

export default (insert_after = true) => {
	const selection = $getSelection() as TableSelection

	if (!$isRangeSelection(selection) && !$isTableSelection(selection)) return

	const anchor = selection.anchor.getNode()
	const focus = selection.focus.getNode()
	const [anchor_cell] = $getNodeTriplet(anchor)
	const [focus_cell, , grid] = $getNodeTriplet(focus)
	const [grid_map, focus_cell_map, anchor_cell_map] = $computeTableMap(grid, focus_cell, anchor_cell)
	const row_count = grid_map.length
	const start_column = insert_after
		? Math.max(focus_cell_map.start_column, anchor_cell_map.start_column)
		: Math.min(focus_cell_map.start_column, anchor_cell_map.start_column)

	const insert_after_column = insert_after ? start_column + focus_cell.__col_span - 1 : start_column - 1
	const grid_first_child = grid.getFirstChild()

	let first_inserted_cell: TableCellNode | null = null
	let loop_row = grid_first_child as TableRowNode

	row_loop: for (let i = 0; i < row_count; i++) {
		if (i !== 0) {
			loop_row = loop_row.getNextSibling()!
		}

		const row_map = grid_map[i]

		if (insert_after_column < 0) {
			const cell = $createTableCellNode({}).append($createParagraphNode())

			$insertFirst(loop_row, cell)

			continue
		}
		const {
			cell: current_cell,
			start_column: current_start_column,
			start_row: current_start_row
		} = row_map[insert_after_column]

		if (current_start_column + current_cell.__col_span - 1 <= insert_after_column) {
			let insert_after_cell: TableCellNode = current_cell
			let insert_after_cell_row_start = current_start_row
			let prev_cell_index = insert_after_column

			while (insert_after_cell_row_start !== i && insert_after_cell.__row_span > 1) {
				prev_cell_index -= current_cell.__col_span

				if (prev_cell_index >= 0) {
					const { cell, start_row } = row_map[prev_cell_index]

					insert_after_cell = cell
					insert_after_cell_row_start = start_row
				} else {
					const cell = $createTableCellNode({}).append($createParagraphNode())

					loop_row.append(cell)

					continue row_loop
				}
			}

			insert_after_cell.insertAfter($createTableCellNode({}).append($createParagraphNode()))
		} else {
			current_cell.setColSpan(current_cell.__col_span + 1)
		}
	}

	if (first_inserted_cell !== null) {
		$moveSelectionToCell(first_inserted_cell)
	}
}
