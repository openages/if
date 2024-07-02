import { $createParagraphNode, $createTextNode, $isParagraphNode, $isTextNode } from 'lexical'

import { $convertToMarkdownString } from '@lexical/markdown'

import TableCellNode from '../plugins/Table/TableCellNode'
import TableNode from '../plugins/Table/TableNode'
import TableRowNode from '../plugins/Table/TableRowNode'
import {
	$createTableCellNode,
	$createTableNode,
	$createTableRowNode,
	$isTableNode,
	$isTableRowNode
} from '../plugins/Table/utils'
import transformers from './'

import type { ElementTransformer } from '@lexical/markdown'

const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/

const getCells = (v: string) => {
	const match = v.match(TABLE_ROW_REG_EXP)

	if (!match || !match[1]) return

	return match[1].split('|').map(text => {
		const cell = $createTableCellNode({})
		const p = $createParagraphNode()
		const t = $createTextNode()

		t.setTextContent(text)

		p.append(t)
		cell.append(p)

		return cell
	})
}

const getTableColumnsSize = (table: TableNode) => {
	const row = table.getFirstChild() as TableRowNode

	return $isTableRowNode(row) ? row.getChildrenSize() : 0
}

export default {
	type: 'element',
	regExp: TABLE_ROW_REG_EXP,
	dependencies: [TableNode, TableRowNode, TableCellNode],
	export: (node: TableNode) => {
		if (!$isTableNode(node)) return null

		const output = [] as Array<string>
		const rows = node.getChildren() as Array<TableRowNode>

		rows.forEach((row, row_index) => {
			const row_output = []
			const cells = row.getChildren() as Array<TableCellNode>

			cells.forEach(cell => {
				row_output.push($convertToMarkdownString(transformers, cell, true).replace(/\n/g, '\\n'))
			})

			output.push(`| ${row_output.join(' | ')} |`)

			if (row_index === 0) {
				output.push(`| ${row_output.map(_ => '---').join(' | ')} |`)
			}
		})

		return output.join('\n')
	},
	replace(parent, _children, match) {
		if (TABLE_ROW_DIVIDER_REG_EXP.test(match[0])) {
			const table = parent.getPreviousSibling() as TableNode

			if (!table || !$isTableNode(table)) return

			const rows = table.getChildren()

			const lastRow = rows[rows.length - 1] as TableRowNode

			if (!lastRow || !$isTableRowNode(lastRow)) return

			parent.remove()

			return
		}

		const cells = getCells(match[0])

		if (!cells) return

		const rows = [cells]

		let sibling = parent.getPreviousSibling()
		let max_cells = cells.length

		while (sibling) {
			if (!$isParagraphNode(sibling)) {
				break
			}

			if (sibling.getChildrenSize() !== 1) {
				break
			}

			const first_child = sibling.getFirstChild()

			if (!$isTextNode(first_child)) {
				break
			}

			const cells = getCells(first_child.getTextContent())

			if (cells == null) {
				break
			}

			max_cells = Math.max(max_cells, cells.length)

			rows.unshift(cells)

			const prev_sibling = sibling.getPreviousSibling()

			sibling.remove()

			sibling = prev_sibling
		}

		const table = $createTableNode()

		for (const cells of rows) {
			const row = $createTableRowNode()

			table.append(row)

			for (let i = 0; i < max_cells; i++) {
				row.append(i < cells.length ? (cells[i] as TableCellNode) : $createTableCellNode({}))
			}
		}

		const prev_sibling = parent.getPreviousSibling() as TableNode

		if ($isTableNode(prev_sibling) && getTableColumnsSize(prev_sibling) === max_cells) {
			prev_sibling.append(...table.getChildren())

			parent.remove()
		} else {
			parent.replace(table)
		}

		table.selectNext()
	}
} as ElementTransformer
