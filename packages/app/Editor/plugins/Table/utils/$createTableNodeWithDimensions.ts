import { $createTableNode, $createTableRowNode } from './index'

export default (rowCount: number, columnCount: number, includeHeaders: InsertTableCommandPayloadHeaders = true) => {
	const tableNode = $createTableNode()

	for (let iRow = 0; iRow < rowCount; iRow++) {
		const tableRowNode = $createTableRowNode()

		for (let iColumn = 0; iColumn < columnCount; iColumn++) {
			let headerState = TableCellHeaderStates.NO_STATUS

			if (typeof includeHeaders === 'object') {
				if (iRow === 0 && includeHeaders.rows) {
					headerState |= TableCellHeaderStates.ROW
				}
				if (iColumn === 0 && includeHeaders.columns) {
					headerState |= TableCellHeaderStates.COLUMN
				}
			} else if (includeHeaders) {
				if (iRow === 0) {
					headerState |= TableCellHeaderStates.ROW
				}
				if (iColumn === 0) {
					headerState |= TableCellHeaderStates.COLUMN
				}
			}

			const tableCellNode = $createTableCellNode(headerState)
			const paragraphNode = $createParagraphNode()
			paragraphNode.append($createTextNode())
			tableCellNode.append(paragraphNode)
			tableRowNode.append(tableCellNode)
		}

		tableNode.append(tableRowNode)
	}

	return tableNode
}
