import { $isTabNode } from 'lexical'

import { $isCodeTextNode } from './index'

import type { LexicalNode } from 'lexical'

export default (anchor: LexicalNode) => {
	let nextNode = anchor
	let node = anchor

	while ($isCodeTextNode(node) || $isTabNode(node)) {
		nextNode = node
		node = node.getNextSibling()!
	}

	return nextNode
}
