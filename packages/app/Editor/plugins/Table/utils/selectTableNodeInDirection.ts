import type TableNode from '../TableNode'
import type TableObserver from '../TableObserver'
import type { Direction } from '../types'
import type TableCellNode from '../TableCellNode'

function selectTableCellNode(cell: TableCellNode, from_start: boolean) {
	if (from_start) {
		cell.selectStart()
	} else {
		cell.selectEnd()
	}
}

export default (table_observer: TableObserver, table_node: TableNode, x: number, y: number, direction: Direction) => {
	const is_forward = direction === 'forward'

	switch (direction) {
		case 'backward':
		case 'forward':
			if (x !== (is_forward ? table_observer.table.col_counts - 1 : 0)) {
				selectTableCellNode(
					table_node.getCellNodeFromCords(x + (is_forward ? 1 : -1), y, table_observer.table),
					is_forward
				)
			} else {
				if (y !== (is_forward ? table_observer.table.row_counts - 1 : 0)) {
					selectTableCellNode(
						table_node.getCellNodeFromCords(
							is_forward ? 0 : table_observer.table.col_counts - 1,
							y + (is_forward ? 1 : -1),
							table_observer.table
						),
						is_forward
					)
				} else if (!is_forward) {
					table_node.selectPrevious()
				} else {
					table_node.selectNext()
				}
			}

			return true

		case 'up':
			if (y !== 0) {
				selectTableCellNode(table_node.getCellNodeFromCords(x, y - 1, table_observer.table), false)
			} else {
				table_node.selectPrevious()
			}

			return true

		case 'down':
			if (y !== table_observer.table.row_counts - 1) {
				selectTableCellNode(table_node.getCellNodeFromCords(x, y + 1, table_observer.table), true)
			} else {
				table_node.selectNext()
			}

			return true
		default:
			return false
	}
}
