import type TableCellNode from '../TableCellNode'

export default (cell: TableCellNode) => {
	const first_descendant = cell.getFirstDescendant()

	if (first_descendant == null) {
		cell.selectStart()
	} else {
		first_descendant.getParentOrThrow().selectStart()
	}
}
