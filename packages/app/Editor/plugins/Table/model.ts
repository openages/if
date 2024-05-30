import {
	$createParagraphNode,
	$getNodeByKey,
	$insertNodes,
	$isTextNode,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_HIGH
} from 'lexical'
import { injectable } from 'tsyringe'

import { INSERT_TABLE_COMMAND, SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import Utils from '@/models/utils'
import { $insertFirst, mergeRegister } from '@lexical/utils'

import TableCellNode from './TableCellNode'
import TableNode from './TableNode'
import {
	$computeTableMap,
	$createTableCellNode,
	$createTableNodeWithDimensions,
	$getNodeTriplet,
	$isTableNode,
	$updateTableCols,
	applyTableHandlers
} from './utils'

import type { HTMLTableElementWithWithTableSelectionState } from './types'
import type TableObserver from './TableObserver'
import type { LexicalEditor, NodeMutation } from 'lexical'
import type TableRowNode from './TableRowNode'

@injectable()
export default class Index {
	editor = null as LexicalEditor
	table_selections = {} as Record<string, TableObserver>

	unregister = null as () => void

	constructor(public utils: Utils) {}

	init(editor: Index['editor']) {
		this.editor = editor

		this.on()
	}

	onInsert() {
		const table_node = $createTableNodeWithDimensions(3, 3)

		$insertNodes([table_node])

		const first_descendant = table_node.getFirstDescendant()

		if ($isTextNode(first_descendant)) {
			first_descendant.select()
		}

		return true
	}

	onMutation(mutations: Map<string, NodeMutation>) {
		for (const [node_key, mutation] of mutations) {
			if (mutation === 'created') {
				this.editor.getEditorState().read(() => {
					const table_node = $getNodeByKey<TableNode>(node_key)

					if ($isTableNode(table_node)) {
						this.addObservers(node_key)
					}
				})
			} else if (mutation === 'destroyed') {
				const table_selection = this.table_selections[node_key]

				if (table_selection) {
					table_selection.removeListeners()

					delete this.table_selections[node_key]
				}
			}
		}
	}

	onTransformTable(node: TableNode) {
		const [map] = $computeTableMap(node, null, null)

		$updateTableCols(this.editor, node)

		const max_row_length = map.reduce((cur_length, row) => {
			return Math.max(cur_length, row.length)
		}, 0)

		// for (let i = 0; i < map.length; ++i) {
		// 	const row_length = map[i].length

		// 	if (row_length === max_row_length) {
		// 		continue
		// 	}

		// 	const last_cell_map = map[i][row_length - 1]
		// 	const last_row_cell = last_cell_map.cell

		// 	for (let j = row_length; j < max_row_length; ++j) {
		// 		const new_cell = $createTableCellNode({})

		// 		new_cell.append($createParagraphNode())

		// 		if (last_row_cell !== null) {
		// 			last_row_cell.insertAfter(new_cell)
		// 		} else {
		// 			$insertFirst(last_row_cell, new_cell)
		// 		}
		// 	}
		// }
	}

	checkSelection(path: Array<{ type: string; key: string }>) {
		if (path.find(item => item.type === 'table') !== undefined) {
			this.addListeners()
		} else {
			this.removeListeners()
		}

		const selection_keys = Object.keys(this.table_selections)

		selection_keys.forEach(key => {
			if (path.find(item => item.key === key) === undefined) {
				this.table_selections[key].removeListeners()

				delete this.table_selections[key]
			}
		})

		path.forEach(item => {
			if (item.type === 'table' && !this.table_selections[item.key]) {
				this.addObservers(item.key)
			}
		})

		return false
	}

	addObservers(key: string) {
		const table_node = $getNodeByKey(key) as TableNode
		const table_element = this.editor.getElementByKey(key) as HTMLTableElementWithWithTableSelectionState

		if (table_element && !this.table_selections[key]) {
			const table_selection = applyTableHandlers(table_node, table_element, this.editor)

			this.table_selections[key] = table_selection
		}
	}

	addListeners() {
		if (this.unregister) this.unregister()

		this.unregister = mergeRegister(
			this.editor.registerNodeTransform(TableNode, this.onTransformTable.bind(this))
		)
	}

	removeListeners() {
		if (!this.unregister) return

		this.unregister()

		this.unregister = null

		for (const key in this.table_selections) {
			this.table_selections[key].removeListeners()
		}

		this.table_selections = {}
	}

	on() {
		this.utils.acts.push(
			this.editor.registerCommand(INSERT_TABLE_COMMAND, this.onInsert.bind(this), COMMAND_PRIORITY_EDITOR),
			this.editor.registerMutationListener(TableNode, this.onMutation.bind(this)),
			this.editor.registerCommand(
				SELECTION_ELEMENTS_CHANGE,
				this.checkSelection.bind(this),
				COMMAND_PRIORITY_HIGH
			)
		)
	}

	off() {
		this.utils.off()

		this.unregister?.()

		this.unregister = null
	}
}
