import { $createParagraphNode, $insertNodes } from 'lexical'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	let alone = false

	if (!node.__prev && !node.__next) {
		alone = true
	}

	node.remove()

	if (alone) {
		$insertNodes([$createParagraphNode()])
	}
}
