import { $isRangeSelection } from 'lexical'

import { $isCodeNode } from './index'

import type { BaseSelection } from 'lexical'

export default (selection: null | BaseSelection): boolean => {
	if (!$isRangeSelection(selection)) return false

	const anchor_node = selection.anchor.getNode()
	const focus_node = selection.focus.getNode()

	if (anchor_node.is(focus_node) && $isCodeNode(anchor_node)) return true

	const anchor_parent = anchor_node.getParent()

	return $isCodeNode(anchor_parent) && anchor_parent.is(focus_node.getParent())
}
