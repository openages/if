import { $getEditor, $getNearestNodeFromDOMNode, ElementNode } from 'lexical'

import { isHTMLElement } from '@lexical/utils'

import { $convertTableElement, $createTableNode, $isTableCellNode } from './utils'

import type TableRowNode from './TableRowNode'
import type TableCellNode from './TableCellNode'
import type { Table, IPropsTableNode, SerializedTableNode, IPropsTableCol } from './types'
import type { DOMConversionMap, DOMExportOutput, LexicalEditor } from 'lexical'

export default class TableNode extends ElementNode {
	__cols = {} as IPropsTableNode['cols']

	constructor(props: IPropsTableNode) {
		const { cols, node_key } = props

		super(node_key)

		if (cols) this.__cols = cols
	}

	static getType() {
		return 'table'
	}

	static clone(node: TableNode) {
		return new TableNode({ cols: node.__cols, node_key: node.__key })
	}

	static importDOM(): DOMConversionMap {
		return { table: () => ({ conversion: $convertTableElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedTableNode) {
		return $createTableNode({ cols: serializedNode.cols })
	}

	createDOM() {
		const el = document.createElement('table')

		el.className = '__editor_table'

		const col_keys = Object.keys(this.__cols)

		if (col_keys.length) {
			const editor = $getEditor()
			const rows = this.getChildren() as Array<TableRowNode>

			col_keys.forEach(key => {
				const target_key = Number(key)
				const target_value = this.__cols[target_key]
				const row = rows[target_key]
				const cells = row.getChildren() as Array<TableCellNode>

				cells.forEach((item, index) => {
					if (target_key !== index) return

					const el = editor.getElementByKey(item.getKey()) as HTMLTableCellElement

					if (target_value.align) el.setAttribute('align', target_value.align)
					if (target_value.width) el.setAttribute('width', String(target_value.width))
				})
			})
		}

		return el
	}

	updateDOM() {
		return false
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		return {
			...super.exportDOM(editor),
			after: el => {
				if (el) {
					const new_el = el.cloneNode() as ParentNode
					const col_group = document.createElement('colgroup')
					const t_body = document.createElement('tbody')

					if (isHTMLElement(el)) {
						t_body.append(...(el.children as HTMLCollection & Iterable<HTMLTableElement>))
					}

					const first_row = this.getFirstChildOrThrow<TableRowNode>()

					for (let i = 0; i < first_row.getChildrenSize(); i++) {
						const col = document.createElement('col')

						col_group.append(col)
					}

					new_el.replaceChildren(col_group, t_body)

					return new_el as HTMLElement
				}
			}
		}
	}

	exportJSON(): SerializedTableNode {
		return { ...super.exportJSON(), type: 'table', cols: this.__cols }
	}

	canBeEmpty() {
		return false
	}

	isShadowRoot() {
		return true
	}

	canSelectBefore() {
		return true
	}

	canIndent() {
		return false
	}

	cloneCol(col_index: number) {
		const target = this.getWritable()
		const col_value = target.__cols[col_index]

		target.__cols[col_index + 1] = col_value
	}

	updateCol(col_index: number, v: IPropsTableCol) {
		const target = this.getWritable()
		const col_value = target.__cols[col_index]

		if (col_value) {
			target.__cols[col_index] = { ...col_value, ...v }
		} else {
			target.__cols[col_index] = v
		}
	}

	resetColAttr(col_index: number, attr: 'align' | 'width') {
		const target = this.getWritable()

		if (!target.__cols[col_index]?.[attr]) return

		if (Object.keys(target.__cols[col_index]).length === 1) {
			delete target.__cols[col_index]
		} else {
			delete target.__cols[col_index][attr]
		}
	}

	getCordsFromCellNode(table_cell_node: TableCellNode, table: Table): { x: number; y: number } {
		const { rows, row_counts } = table

		for (let y = 0; y < row_counts; y++) {
			const row = rows[y]

			if (row == null) {
				continue
			}

			const x = row.findIndex(cell => {
				if (!cell) return

				const { el } = cell
				const node = $getNearestNodeFromDOMNode(el)

				return node === table_cell_node
			})

			if (x !== -1) {
				return { x, y }
			}
		}

		throw new Error('Cell not found in table.')
	}

	getDOMCellFromCords(x: number, y: number, table: Table) {
		const { rows } = table

		const row = rows[y]

		if (row == null) return null

		const cell = row[x]

		if (cell == null) return null

		return cell
	}

	getDOMCellFromCordsOrThrow(x: number, y: number, table: Table) {
		const cell = this.getDOMCellFromCords(x, y, table)

		if (!cell) {
			throw new Error('Cell not found at cords.')
		}

		return cell
	}

	getCellNodeFromCords(x: number, y: number, table: Table) {
		const cell = this.getDOMCellFromCords(x, y, table)

		if (!cell) return null

		const node = $getNearestNodeFromDOMNode(cell.el)

		if ($isTableCellNode(node)) return node as TableCellNode

		return null
	}

	getCellNodeFromCordsOrThrow(x: number, y: number, table: Table) {
		const node = this.getCellNodeFromCords(x, y, table) as TableCellNode

		if (!node) {
			throw new Error('Node at cords not TableCellNode.')
		}

		return node
	}
}
