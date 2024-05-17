import { $isElementNode } from 'lexical'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	const nodes = []
	const stack = [node]

	while (stack.length > 0) {
		const currentNode = stack.pop()

		if ($isElementNode(currentNode)) {
			stack.unshift(...currentNode.getChildren())
		}

		if (currentNode !== node) {
			nodes.push(currentNode)
		}
	}

	return nodes
}
