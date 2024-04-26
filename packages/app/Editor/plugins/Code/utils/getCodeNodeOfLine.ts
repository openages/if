import { $isTabNode } from 'lexical'

import { $isCodeNode } from './index'

import type { LexicalNode, LineBreakNode, TabNode } from 'lexical'
import type CodeNode from '../Node'

export default (type: 'first' | 'last', anchor: LexicalNode | CodeNode | TabNode | LineBreakNode) => {
	let target_node = anchor
	let node = anchor

	while ($isCodeNode(node) || $isTabNode(node)) {
		target_node = node
		node = type === 'first' ? node.getPreviousSibling() : node.getNextSibling()
	}

	return target_node
}
