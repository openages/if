import {
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
	$getTableRowIndexFromTableCellNode,
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
		const row_index = $getTableRowIndexFromTableCellNode(table_cell_node)
		const col_index = $getTableColumnIndexFromTableCellNode(table_cell_node)
		const rows = table_node.getChildren() as Array<TableRowNode>
		const cells = table_row_node.getChildren() as Array<TableCellNode>

		const row_counts = Math.max(
			...rows.map(item => {
				const cells = item.getChildren() as Array<TableCellNode>

				return cells.reduce((total, i) => total + i.getRowSpan(), 0)
			})
		)

		if (keyPath.length === 2) {
			if (key === 'left') {
				table_node.resetColAttr(col_index, 'align')
			} else {
				table_node.updateCol(col_index, { align: key })
			}
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

				const target = cells.map((item: TableCellNode) =>
					$createTableCellNode({
						is_header: item.__is_header,
						col_span: item.getColSpan()
					}).append($createParagraphNode())
				)

				if (key === 'insert_above') {
					table_node.splice(row_index, 0, [row.append(...target)])
				} else {
					table_node.splice(row_index + table_cell_node.getRowSpan(), 0, [row.append(...target)])
				}
			}

			if (key === 'insert_left' || key === 'insert_right') {
				Array.from({ length: row_counts }).forEach((_, _row_index) => {
					const row = rows[_row_index]

					if (!row) return

					const cells = row.getChildren() as Array<TableCellNode>

					let target: TableCellNode

					cells.forEach((item, _col_index) => {
						if (col_index !== _col_index) {
							if (!cells[col_index]) {
								target = $createTableCellNode({}).append($createParagraphNode())
							}

							return
						}

						target = $createTableCellNode({ is_header: item.__is_header }).append(
							$createParagraphNode()
						)
					})

					if (cells[col_index]) {
						row.splice(col_index + (key === 'insert_right' ? 1 : 0), 0, [target])
					} else {
						row.append(...[target])
					}
				})
			}

			if (key === 'clone_row') {
				const row = $createTableRowNode()

				const target = cells.map((item: TableCellNode) => {
					const cell = $createTableCellNode({
						is_header: item.__is_header,
						col_span: item.getColSpan()
					})

					cell.append(...item.getChildren().map(i => $cloneNode(i)))

					return cell
				})

				table_node.splice(row_index + table_cell_node.getRowSpan(), 0, [row.append(...target)])
			}

			if (key === 'clear_row') {
				const cells = table_row_node.getChildren() as Array<TableCellNode>

				cells.forEach(item => {
					item.clear()
					item.append($createParagraphNode())
				})
			}

			if (key === 'remove_row') {
				if (table_row_node.isLastChild()) return

				table_row_node.remove()
			}

			if (key === 'reset_width') {
				table_node.resetColAttr(col_index, 'width')
			}

			if (key === 'clone_col' || key === 'clear_col' || key === 'remove_col') {
				const cols = rows[0].getChildren()

				if (key === 'clone_col') {
					table_node.cloneCol(col_index)

					rows.forEach((row, _row_index) => {
						const cells = row.getChildren() as Array<TableCellNode>

						let target: TableCellNode

						cells.forEach((item, _col_index) => {
							if (col_index !== _col_index) {
								if (!cells[col_index]) {
									target = $createTableCellNode({}).append($createParagraphNode())
								}

								return
							}

							const cell = $createTableCellNode({ is_header: item.__is_header })

							target = cell.append(...item.getChildren().map(i => $cloneNode(i)))
						})

						if (cells[col_index]) {
							row.splice(col_index + 1, 0, [target])
						} else {
							row.append(target)
						}
					})

					return
				}

				if (key === 'remove_col' && col_index === cols.length - 1) return

				rows.forEach((row, _row_index) => {
					const cells = row.getChildren() as Array<TableCellNode>

					cells.forEach((item, _col_index) => {
						if (col_index !== _col_index) return

						switch (key) {
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
