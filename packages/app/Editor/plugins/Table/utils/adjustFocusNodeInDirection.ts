import type TableObserver from '../TableObserver'
import type TableNode from '../TableNode'
import type { Direction } from '../types'

export default (table_observer: TableObserver, table_node: TableNode, x: number, y: number, direction: Direction) => {
	const is_forward = direction === 'forward'

	switch (direction) {
		case 'backward':
		case 'forward':
			if (x !== (is_forward ? table_observer.table.col_counts - 1 : 0)) {
				table_observer.setFocusCellForSelection(
					table_node.getCellNodeFromCords(x + (is_forward ? 1 : -1), y, table_observer.table)
				)
			}

			return true
		case 'up':
			if (y !== 0) {
				table_observer.setFocusCellForSelection(
					table_node.getCellNodeFromCords(x, y - 1, table_observer.table)
				)

				return true
			} else {
				return false
			}
		case 'down':
			if (y !== table_observer.table.row_counts - 1) {
				table_observer.setFocusCellForSelection(
					table_node.getCellNodeFromCords(x, y + 1, table_observer.table)
				)

				return true
			} else {
				return false
			}
		default:
			return false
	}
}
