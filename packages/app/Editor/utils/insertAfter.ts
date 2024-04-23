import { $createParagraphNode } from 'lexical'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	const parent = node.getTopLevelElement()

	if (!parent.__next) {
		const p = $createParagraphNode()

		parent.insertAfter(p)

		p.selectStart()
	} else {
		parent.getNextSibling().selectEnd()
	}
}
