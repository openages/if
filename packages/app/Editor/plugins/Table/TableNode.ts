import { $getNearestNodeFromDOMNode, ElementNode } from 'lexical'

import { isHTMLElement } from '@lexical/utils'

import { $isTableCellNode } from './LexicalTableCellNode'
import { TableDOMTable } from './LexicalTableObserver'
import { $isTableRowNode, TableRowNode } from './LexicalTableRowNode'
import { $convertTableElement, $createTableNode } from './utils'

import type { TableCellNode } from './LexicalTableCellNode'
import type { DOMConversionMap, DOMExportOutput, LexicalEditor, NodeKey, SerializedElementNode } from 'lexical'

export default class TableNode extends ElementNode {
	constructor(key?: NodeKey) {
		super(key)
	}

	static getType() {
		return 'table'
	}

	static clone(node: TableNode) {
		return new TableNode(node.__key)
	}

	static importDOM(): DOMConversionMap {
		return { table: () => ({ conversion: $convertTableElement, priority: 0 }) }
	}

	static importJSON() {
		return $createTableNode()
	}

	createDOM() {
		return document.createElement('table')
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

					if (!$isTableRowNode(first_row)) {
						throw new Error('Expected to find row node.')
					}

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

	exportJSON(): SerializedElementNode {
		return { ...super.exportJSON(), type: 'table' }
	}

	canBeEmpty(): false {
		return false
	}

	isShadowRoot(): boolean {
		return true
	}

	getCordsFromCellNode(tableCellNode: TableCellNode, table: TableDOMTable): { x: number; y: number } {
		const { rows, domRows } = table

		for (let y = 0; y < rows; y++) {
			const row = domRows[y]

			if (row == null) {
				continue
			}

			const x = row.findIndex(cell => {
				if (!cell) {
					return
				}
				const { elem } = cell
				const cellNode = $getNearestNodeFromDOMNode(elem)
				return cellNode === tableCellNode
			})

			if (x !== -1) {
				return { x, y }
			}
		}

		throw new Error('Cell not found in table.')
	}

	getDOMCellFromCords(x: number, y: number, table: TableDOMTable) {
		const { domRows } = table

		const row = domRows[y]

		if (row == null) return null

		const cell = row[x]

		if (cell == null) return null

		return cell
	}

	getDOMCellFromCordsOrThrow(x: number, y: number, table: TableDOMTable) {
		const cell = this.getDOMCellFromCords(x, y, table)

		if (!cell) {
			throw new Error('Cell not found at cords.')
		}

		return cell
	}

	getCellNodeFromCords(x: number, y: number, table: TableDOMTable) {
		const cell = this.getDOMCellFromCords(x, y, table)

		if (!cell) return null

		const node = $getNearestNodeFromDOMNode(cell.elem)

		if ($isTableCellNode(node)) return node

		return null
	}

	getCellNodeFromCordsOrThrow(x: number, y: number, table: TableDOMTable) {
		const node = this.getCellNodeFromCords(x, y, table)

		if (!node) {
			throw new Error('Node at cords not TableCellNode.')
		}

		return node
	}

	canSelectBefore() {
		return true
	}

	canIndent() {
		return false
	}
}
