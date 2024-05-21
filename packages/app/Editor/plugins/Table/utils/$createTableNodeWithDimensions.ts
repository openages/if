import { $createParagraphNode, $createTextNode } from 'lexical'

import { $createTableCellNode, $createTableNode, $createTableRowNode } from './index'

export default (row_count: number, col_count: number) => {
	const table = $createTableNode()

	for (let row_index = 0; row_index < row_count; row_index++) {
		const row = $createTableRowNode()

		for (let col_index = 0; col_index < col_count; col_index++) {
			const cell = $createTableCellNode({ is_header: row_index === 0 })
			const p = $createParagraphNode()

			p.append($createTextNode())

			cell.append(p)
			row.append(cell)
		}

		table.append(row)
	}

	return table
}
