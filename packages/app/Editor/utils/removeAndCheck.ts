import { $createParagraphNode, $insertNodes, $isRootNode } from 'lexical'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	const parent = node.getTopLevelElement()

	let alone = false

	if (parent && $isRootNode(parent.getParent())) {
		if (!node.__prev && !node.__next) {
			alone = true
		}
	}

	node.remove()

	if (alone) {
		$insertNodes([$createParagraphNode()])
	}
}
