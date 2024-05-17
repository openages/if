import { $getSelection, $isElementNode, $isRangeSelection } from 'lexical'

import { isPickerInView, stopEvent } from '@/Editor/utils'
import { $findMatchingParent } from '@lexical/utils'

import {
	$findTableNode,
	$isSelectionInTable,
	$isTableCellNode,
	$isTableNode,
	$isTableSelection,
	getTable,
	isExitingTableAnchor
} from './index'

import type { LexicalEditor } from 'lexical'
import type { Direction } from '../types'
import type TableNode from '../TableNode'
import type TableObserver from '../TableObserver'

const Index = (
	editor: LexicalEditor,
	event: KeyboardEvent,
	direction: Direction,
	tableNode: TableNode,
	tableObserver: TableObserver
) => {
	if ((direction === 'up' || direction === 'down') && isPickerInView(editor)) {
		return false
	}

	const selection = $getSelection()

	if (!$isSelectionInTable(selection, tableNode)) {
		if (direction === 'backward' && $isRangeSelection(selection) && selection.isCollapsed()) {
			const anchorType = selection.anchor.type
			const anchorOffset = selection.anchor.offset

			if (anchorType !== 'element' && !(anchorType === 'text' && anchorOffset === 0)) {
				return false
			}

			const anchorNode = selection.anchor.getNode()

			if (!anchorNode) {
				return false
			}

			const parentNode = $findMatchingParent(anchorNode, n => $isElementNode(n) && !n.isInline())
			if (!parentNode) {
				return false
			}
			const siblingNode = parentNode.getPreviousSibling()
			if (!siblingNode || !$isTableNode(siblingNode)) {
				return false
			}
			stopEvent(event)
			siblingNode.selectEnd()
			return true
		}
		return false
	}

	if ($isRangeSelection(selection) && selection.isCollapsed()) {
		const { anchor, focus } = selection
		const anchorCellNode = $findMatchingParent(anchor.getNode(), $isTableCellNode)
		const focusCellNode = $findMatchingParent(focus.getNode(), $isTableCellNode)

		if (!$isTableCellNode(anchorCellNode) || !anchorCellNode.is(focusCellNode)) {
			return false
		}
		const anchorCellTable = $findTableNode(anchorCellNode) as TableNode

		if (anchorCellTable !== tableNode && anchorCellTable != null) {
			const anchorCellTableElement = editor.getElementByKey(anchorCellTable.getKey())

			if (anchorCellTableElement != null) {
				tableObserver.table = getTable(anchorCellTableElement)

				return Index(editor, event, direction, anchorCellTable, tableObserver)
			}
		}

		if (direction === 'backward' || direction === 'forward') {
			const anchorType = anchor.type
			const anchorOffset = anchor.offset
			const anchorNode = anchor.getNode()
			if (!anchorNode) {
				return false
			}

			if (isExitingTableAnchor(anchorType, anchorOffset, anchorNode, direction)) {
				return $handleTableExit(event, anchorNode, tableNode, direction)
			}

			return false
		}

		const anchorCellDom = editor.getElementByKey(anchorCellNode.__key)
		const anchorDOM = editor.getElementByKey(anchor.key)

		if (anchorDOM == null || anchorCellDom == null) {
			return false
		}

		let edgeSelectionRect
		if (anchor.type === 'element') {
			edgeSelectionRect = anchorDOM.getBoundingClientRect()
		} else {
			const domSelection = window.getSelection()
			if (domSelection === null || domSelection.rangeCount === 0) {
				return false
			}

			const range = domSelection.getRangeAt(0)
			edgeSelectionRect = range.getBoundingClientRect()
		}

		const edgeChild = direction === 'up' ? anchorCellNode.getFirstChild() : anchorCellNode.getLastChild()
		if (edgeChild == null) {
			return false
		}

		const edgeChildDOM = editor.getElementByKey(edgeChild.__key)

		if (edgeChildDOM == null) {
			return false
		}

		const edgeRect = edgeChildDOM.getBoundingClientRect()
		const isExiting =
			direction === 'up'
				? edgeRect.top > edgeSelectionRect.top - edgeSelectionRect.height
				: edgeSelectionRect.bottom + edgeSelectionRect.height > edgeRect.bottom

		if (isExiting) {
			stopEvent(event)

			const cords = tableNode.getCordsFromCellNode(anchorCellNode, tableObserver.table)

			if (event.shiftKey) {
				const cell = tableNode.getDOMCellFromCordsOrThrow(cords.x, cords.y, tableObserver.table)
				tableObserver.setAnchorCellForSelection(cell)
				tableObserver.setFocusCellForSelection(cell, true)
			} else {
				return selectTableNodeInDirection(tableObserver, tableNode, cords.x, cords.y, direction)
			}

			return true
		}
	} else if ($isTableSelection(selection)) {
		const { anchor, focus } = selection
		const anchorCellNode = $findMatchingParent(anchor.getNode(), $isTableCellNode)
		const focusCellNode = $findMatchingParent(focus.getNode(), $isTableCellNode)

		const [tableNodeFromSelection] = selection.getNodes()
		const tableElement = editor.getElementByKey(tableNodeFromSelection.getKey())
		if (
			!$isTableCellNode(anchorCellNode) ||
			!$isTableCellNode(focusCellNode) ||
			!$isTableNode(tableNodeFromSelection) ||
			tableElement == null
		) {
			return false
		}
		tableObserver.updateTableTableSelection(selection)

		const grid = getTable(tableElement)
		const cordsAnchor = tableNode.getCordsFromCellNode(anchorCellNode, grid)
		const anchorCell = tableNode.getDOMCellFromCordsOrThrow(cordsAnchor.x, cordsAnchor.y, grid)
		tableObserver.setAnchorCellForSelection(anchorCell)

		stopEvent(event)

		if (event.shiftKey) {
			const cords = tableNode.getCordsFromCellNode(focusCellNode, grid)
			return adjustFocusNodeInDirection(tableObserver, tableNodeFromSelection, cords.x, cords.y, direction)
		} else {
			focusCellNode.selectEnd()
		}

		return true
	}

	return false
}

export default Index
