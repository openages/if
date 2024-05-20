import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical'

import {
	$computeTableMap,
	$createTableCellNode,
	$createTableRowNode,
	$getNodeTriplet,
	$isTableSelection
} from './index'

import type TableSelection from '../TableSelection'

export default (insert_after = true) => {
	const selection = $getSelection() as TableSelection

	if (!$isRangeSelection(selection) && !$isTableSelection(selection)) return

	const focus = selection.focus.getNode()
	const [focus_cell, , grid] = $getNodeTriplet(focus)
	const [grid_map, focus_cell_map] = $computeTableMap(grid, focus_cell, focus_cell)
	const column_count = grid_map[0].length
	const { start_row: focus_start_row } = focus_cell_map

	if (insert_after) {
		const focus_end_row = focus_start_row + focus_cell.__row_span - 1
		const focus_end_row_map = grid_map[focus_end_row]
		const new_row = $createTableRowNode()

		for (let i = 0; i < column_count; i++) {
			const { cell, start_row } = focus_end_row_map[i]
			if (start_row + cell.__row_span - 1 <= focus_end_row) {
				new_row.append($createTableCellNode({}).append($createParagraphNode()))
			} else {
				cell.setRowSpan(cell.__row_span + 1)
			}
		}

		const focus_end_row_node = grid.getChildAtIndex(focus_end_row)

		focus_end_row_node.insertAfter(new_row)
	} else {
		const focus_start_row_map = grid_map[focus_start_row]
		const new_row = $createTableRowNode()

		for (let i = 0; i < column_count; i++) {
			const { cell, start_row } = focus_start_row_map[i]
			if (start_row === focus_start_row) {
				new_row.append($createTableCellNode({}).append($createParagraphNode()))
			} else {
				cell.setRowSpan(cell.__row_span + 1)
			}
		}

		const focus_start_row_node = grid.getChildAtIndex(focus_start_row)

		focus_start_row_node.insertBefore(new_row)
	}
}
