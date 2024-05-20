import type TableCellNode from './TableCellNode'
import type TableObserver from './TableObserver'

import type { DOMConversionMap, DOMExportOutput, LexicalEditor, NodeKey, SerializedElementNode, Spread } from 'lexical'

export interface Cell {
	el: HTMLElement
	x: number
	y: number
}

export type CellNode = HTMLElement & { _cell: Cell }

export type Row = Array<Cell>
export type Rows = Array<Row>

export interface Table {
	rows: Rows
	row_counts: number
	col_counts: number
}

export interface TableSelectionShape {
	from_x: number
	from_y: number
	to_x: number
	to_y: number
}

export interface TableMapValue {
	cell: TableCellNode
	start_row: number
	start_column: number
}

export type TableMap = Array<Array<TableMapValue>>

export interface IPropsTableCellNode {
	is_header?: boolean
	row_span?: number
	col_span?: number
	node_key?: string
}

export type SerializedTableCellNode = Spread<IPropsTableCellNode, SerializedElementNode>

export type HTMLTableElementWithWithTableSelectionState = HTMLTableElement & Record<string, TableObserver>

export type Direction = 'backward' | 'forward' | 'up' | 'down'

export interface TableCellSiblings {
	above?: TableCellNode
	below?: TableCellNode
	left?: TableCellNode
	right?: TableCellNode
}
