import {
	$copyNode,
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { $cloneNode, $getMatchingParent } from '@/Editor/utils'
import Utils from '@/models/utils'
import { mergeRegister } from '@lexical/utils'
import { useInstanceWatch, Watch } from '@openages/stk/mobx'

import {
	$createTableCellNode,
	$createTableRowNode,
	$getTableColumnIndexFromTableCellNode,
	$isTableCellNode,
	$isTableNode,
	$isTableRowNode
} from '../utils'

import type { LexicalEditor } from 'lexical'
import type TableNode from '../TableNode'
import type TableRowNode from '../TableRowNode'
import type TableCellNode from '../TableCellNode'

@injectable()
export default class Index {
	id = ''
	editor = null as LexicalEditor
	nodes = [] as [TableNode, TableRowNode, TableCellNode] | []
	resize_observer = null as ResizeObserver

	position_row = { left: 0, top: 0 }
	position_col = { left: 0, top: 0 }
	visible = false
	visible_menu_type = '' as 'row' | 'col'

	unregister = null as () => void

	watch = {
		visible: v => {
			const container = document.getElementById(this.id)

			if (v) {
				if (this.nodes[0]) {
					const [table_node] = this.nodes
					const table_node_el = this.editor.getElementByKey(table_node.getKey())

					table_node_el.addEventListener('scroll', this.onScroll)
				}

				container.addEventListener('scroll', this.onScroll)

				this.resize_observer = new ResizeObserver(this.onScroll)

				this.resize_observer.observe(container)
			} else {
				if (this.nodes[0]) {
					const [table_node] = this.nodes
					const table_node_el = this.editor.getElementByKey(table_node.getKey())

					table_node_el.removeEventListener('scroll', this.onScroll)
				}

				document.getElementById(this.id).removeEventListener('scroll', this.onScroll)

				this.resize_observer.unobserve(container)
				this.resize_observer.disconnect()

				this.resize_observer = null
			}
		}
	} as Watch<Index>

	constructor(public utils: Utils) {
		makeAutoObservable(
			this,
			{
				utils: false,
				id: false,
				editor: false,
				nodes: false,
				resize_observer: false,
				unregister: false,
				watch: false
			},
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

	onClick(args: { key: string; keyPath: Array<string> }) {
		const { key, keyPath } = args
		const [table_node, table_row_node, table_cell_node] = this.nodes
		const col_index = $getTableColumnIndexFromTableCellNode(table_cell_node)

		if (keyPath.length === 2) {
			const [_, align] = keyPath
		} else {
			if (key === 'header_row') {
				const cells = table_row_node.getChildren() as Array<TableCellNode>
				const total_is_header = cells.some(item => item.__is_header)

				cells.forEach(item => {
					const target = item.getWritable()

					target.__is_header = !total_is_header
				})
			}

			if (key === 'header_col') {
				const rows = table_node.getChildren() as Array<TableRowNode>
				const total_cells = rows.map(row => row.getChildren()[col_index]) as Array<TableCellNode>
				const total_is_header = total_cells.some(item => item.__is_header)

				rows.forEach(row => {
					const cells = row.getChildren() as Array<TableCellNode>

					cells.forEach((item, index) => {
						if (col_index !== index) return

						const target = item.getWritable()

						target.__is_header = !total_is_header
					})
				})
			}

			if (key === 'insert_above' || key === 'insert_below') {
				const row = $createTableRowNode()

				const cells = table_row_node
					.getChildren()
					.map((item: TableCellNode) => $createTableCellNode({ is_header: item.__is_header }))

				if (key === 'insert_above') {
					table_row_node.insertBefore(row.append(...cells))
				} else {
					table_row_node.insertAfter(row.append(...cells))
				}
			}

			if (key === 'insert_left' || key === 'insert_right') {
				const rows = table_node.getChildren() as Array<TableRowNode>

				rows.forEach((row, _row_index) => {
					const cells = row.getChildren() as Array<TableCellNode>

					cells.forEach((item, _col_index) => {
						if (col_index !== _col_index) return

						const cell = $createTableCellNode({ is_header: item.__is_header })

						if (key === 'insert_left') {
							item.insertBefore(cell)
						} else {
							item.insertAfter(cell)
						}
					})
				})
			}

			if (key === 'clone_row') {
				const clone = $cloneNode(table_row_node)

				table_row_node.insertAfter(clone)
			}

			if (key === 'clear_row') {
				const cells = table_row_node.getChildren() as Array<TableCellNode>

				cells.forEach(item => {
					item.clear()
					item.append($createParagraphNode())
				})
			}

			if (key === 'remove_row') {
				table_row_node.remove()
			}

			if (key === 'clone_col' || key === 'clear_col' || key === 'remove_col') {
				const rows = table_node.getChildren() as Array<TableRowNode>

				rows.forEach((row, _row_index) => {
					const cells = row.getChildren() as Array<TableCellNode>

					cells.forEach((item, _col_index) => {
						if (col_index !== _col_index) return

						switch (key) {
							case 'clone_col':
								item.insertAfter($cloneNode(item))
								break
							case 'clear_col':
								item.clear()
								item.append($createParagraphNode())
								break
							case 'remove_col':
								item.remove()
								break
						}
					})
				})
			}
		}
	}

	getPosition() {
		this.editor.getEditorState().read(() => {
			const [table_node, table_row_node, table_cell_node] = this.nodes
			const col_index = $getTableColumnIndexFromTableCellNode(table_cell_node)
			const first_row_node = table_node.getChildren().at(0) as TableRowNode
			const target_col_node = first_row_node.getChildren().at(col_index)

			if (!table_node || !table_row_node || !table_cell_node || !target_col_node) return

			const table_node_el = this.editor.getElementByKey(table_node.getKey())
			const table_row_node_el = this.editor.getElementByKey(table_row_node.getKey())
			const table_cell_node_el = this.editor.getElementByKey(table_cell_node.getKey())
			const target_col_node_el = this.editor.getElementByKey(target_col_node.getKey())

			const rect_row = table_row_node_el.getBoundingClientRect()
			const rect_cell = table_cell_node_el.getBoundingClientRect()
			const rect_col = target_col_node_el.getBoundingClientRect()

			this.position_row = {
				left: rect_row.x - 0.5 + table_node_el.scrollLeft,
				top: rect_row.y + rect_row.height / 2 - 5
			}

			this.position_col = { left: rect_cell.x + rect_cell.width / 2 - 5, top: rect_col.y - 0.5 }
		})
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
