import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { $getMatchingParent } from '@/Editor/utils'
import Utils from '@/models/utils'
import { mergeRegister } from '@lexical/utils'
import { useInstanceWatch, Watch } from '@openages/stk/mobx'

import { $getTableColumnIndexFromTableCellNode, $isTableCellNode, $isTableNode, $isTableRowNode } from '../utils'

import type { LexicalEditor } from 'lexical'
import type TableNode from '../TableNode'
import type TableRowNode from '../TableRowNode'
import type TableCellNode from '../TableCellNode'

@injectable()
export default class Index {
	id = ''
	editor = null as LexicalEditor
	nodes = [] as [TableNode, TableRowNode, TableCellNode] | []

	position_row = { left: 0, top: 0 }
	position_col = { left: 0, top: 0 }
	visible = false
	visible_menu_type = '' as 'row' | 'col'

	unregister = null as () => void

	watch = {
		visible: v => {
			if (v) {
				document.getElementById(this.id).addEventListener('scroll', this.onScroll)
			} else {
				document.getElementById(this.id).removeEventListener('scroll', this.onScroll)
			}
		}
	} as Watch<Index>

	constructor(public utils: Utils) {
		makeAutoObservable(
			this,
			{ utils: false, id: false, editor: false, nodes: false, unregister: false, watch: false },
			{ autoBind: true }
		)
	}

	init(id: Index['id'], editor: Index['editor']) {
		this.utils.acts = useInstanceWatch(this)

		this.id = id
		this.editor = editor

		this.on()
	}

	reset() {
		this.nodes = []
		this.position_row = { left: 0, top: 0 }
		this.position_col = { left: 0, top: 0 }
		this.visible = false
	}

	getPosition() {
		const [table_node, table_row_node, table_cell_node] = this.nodes
		const col_index = $getTableColumnIndexFromTableCellNode(table_cell_node)
		const first_row_node = table_node.getChildren().at(0) as TableRowNode
		const target_col_node = first_row_node.getChildren().at(col_index)

		const table_row_node_el = this.editor.getElementByKey(table_row_node.getKey())
		const table_cell_node_el = this.editor.getElementByKey(table_cell_node.getKey())
		const target_col_node_el = this.editor.getElementByKey(target_col_node.getKey())

		const rect_row = table_row_node_el.getBoundingClientRect()
		const rect_cell = table_cell_node_el.getBoundingClientRect()
		const rect_col = target_col_node_el.getBoundingClientRect()

		this.position_row = { left: rect_row.x - 0.5, top: rect_row.y + rect_row.height / 2 - 5 }
		this.position_col = { left: rect_cell.x + rect_cell.width / 2 - 5, top: rect_col.y - 0.5 }
	}

	onSelection() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection) || selection.anchor.offset !== selection.focus.offset) {
			this.reset()

			return
		}

		const anchor = selection.anchor.getNode()
		const table_node = $getMatchingParent(anchor, $isTableNode) as TableNode
		const table_row_node = $getMatchingParent(anchor, $isTableRowNode) as TableRowNode
		const table_cell_node = $getMatchingParent(anchor, $isTableCellNode) as TableCellNode

		if (!table_node || !table_row_node || !table_cell_node) {
			this.reset()

			return
		}

		const [prev_table_node, prev_table_row_node, prev_table_cell_node] = this.nodes

		if (
			prev_table_node &&
			prev_table_row_node &&
			prev_table_cell_node &&
			prev_table_node.getKey() === table_node.getKey() &&
			prev_table_row_node.getKey() === table_row_node.getKey() &&
			prev_table_cell_node.getKey() === table_cell_node.getKey()
		) {
			this.getPosition()

			return
		}

		this.nodes = [table_node, table_row_node, table_cell_node]

		this.getPosition()

		this.visible = true

		return false
	}

	onScroll() {
		if (!this.nodes.length) return

		this.getPosition()
	}

	checkSelection(path: Array<{ type: string; key: string }>) {
		if (path.find(item => item.type === 'table') !== undefined) {
			this.addListeners()
		} else {
			this.reset()
			this.removeListeners()
		}

		return false
	}

	addListeners() {
		if (this.unregister) this.unregister()

		this.unregister = mergeRegister(
			this.editor.registerCommand(SELECTION_CHANGE_COMMAND, this.onSelection, COMMAND_PRIORITY_LOW)
		)
	}

	removeListeners() {
		if (!this.unregister) return

		this.unregister()

		this.unregister = null
	}

	on() {
		this.utils.acts.push(
			this.editor.registerCommand(SELECTION_ELEMENTS_CHANGE, this.checkSelection, COMMAND_PRIORITY_HIGH)
		)
	}

	off() {
		this.utils.off()

		this.removeListeners()
	}
}
