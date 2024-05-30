import { $getSelection, COMMAND_PRIORITY_HIGH } from 'lexical'
import { groupBy } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { $cloneNode } from '@/Editor/utils'
import Utils from '@/models/utils'
import { useInstanceWatch, Watch } from '@openages/stk/mobx'

import TableSelection from '../TableSelection'
import {
	$cellContainsEmptyParagraph,
	$getTableColumnIndexFromTableCellNode,
	$isTableCellNode,
	$isTableSelection
} from '../utils'

import type { LexicalEditor } from 'lexical'
import type TableCellNode from '../TableCellNode'

@injectable()
export default class Index {
	id = ''
	editor = null as LexicalEditor

	style = { left: 0, top: 0 }
	visible = false

	watch = {
		visible: v => {
			const container = document.getElementById(this.id)

			if (v) {
				container.addEventListener('scroll', this.getPosition)
			} else {
				container.removeEventListener('scroll', this.getPosition)
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
		if (!this.visible) return

		this.style = { left: 0, top: 0 }
		this.visible = false
	}

	getPosition() {
		this.editor.update(() => {
			const selection = $getSelection() as TableSelection

			const anchor_node = selection.anchor.getNode() as TableCellNode
			const focus_node = selection.focus.getNode() as TableCellNode
			const anchor_el = this.editor.getElementByKey(anchor_node.getKey())
			const focus_el = this.editor.getElementByKey(focus_node.getKey())

			const rect_anchor = anchor_el.getBoundingClientRect()
			const rect_focus = focus_el.getBoundingClientRect()

			const x_values = [rect_anchor.left, rect_anchor.right, rect_focus.left, rect_focus.right]
			const y_values = [rect_anchor.top, rect_anchor.bottom, rect_focus.top, rect_focus.bottom]
			const x_min = Math.min(...x_values)
			const y_min = Math.min(...y_values)
			const width = Math.max(...x_values) - x_min
			const height = Math.max(...y_values) - y_min

			this.style = { left: x_min + width / 2 - 10.5, top: y_min + height / 2 - 10.5 }
			this.visible = true
		})
	}

	mergeCells() {
		const selection = $getSelection() as TableSelection
		const { anchor, focus } = selection
		const { merge_node_type } = selection.getShape()
		const target_node = (merge_node_type === 'anchor' ? anchor : focus).getNode() as TableCellNode
		const rowspan_values = []
		const colspan_values = []

		const cells = selection.getNodes().filter(item => $isTableCellNode(item)) as Array<TableCellNode>
		const els = cells.map(item => this.editor.getElementByKey(item.getKey()))

		if (!(els.every(item => item.tagName === 'TD') || els.every(item => item.tagName === 'TH'))) return

		const group_cols = groupBy(cells, item => $getTableColumnIndexFromTableCellNode(item))
		const group_rows = groupBy(cells, item => item.getParent().getKey())

		Object.keys(group_cols).forEach(row_key => {
			const cells = group_cols[row_key]

			const rowspan = cells.reduce((total, item) => {
				total += item.getRowSpan()

				return total
			}, 0)

			rowspan_values.push(rowspan)
		})

		Object.keys(group_rows).forEach(row_key => {
			const cells = group_rows[row_key]

			const colspan = cells.reduce((total, item) => {
				total += item.getColSpan()

				return total
			}, 0)

			colspan_values.push(colspan)
		})

		const rows = Math.max(...rowspan_values)
		const cols = Math.max(...colspan_values)

		cells.forEach(item => {
			if (!item.is(target_node)) {
				if (!$cellContainsEmptyParagraph(item)) {
					target_node.append(...item.getChildren().map(i => $cloneNode(i)))
				}

				item.remove()
			}
		})

		target_node.setRowSpan(rows).setColSpan(cols)
		target_node.getLastDescendant().selectEnd()
	}

	checkSelection() {
		const selection = $getSelection()

		if ($isTableSelection(selection)) {
			this.getPosition()
		} else {
			this.reset()
		}

		return false
	}

	on() {
		this.utils.acts.push(
			this.editor.registerCommand(SELECTION_ELEMENTS_CHANGE, this.checkSelection, COMMAND_PRIORITY_HIGH)
		)
	}

	off() {
		this.utils.off()
	}
}
