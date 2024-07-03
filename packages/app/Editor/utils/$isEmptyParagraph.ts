import { $isParagraphNode, $isTextNode } from 'lexical'

import { MARKDOWN_EMPTY_LINE_REG_EXP } from './RegExp'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	if (!$isParagraphNode(node)) return false

	const first_child = node.getFirstChild()

	return (
		first_child == null ||
		(node.getChildrenSize() === 1 &&
			$isTextNode(first_child) &&
			MARKDOWN_EMPTY_LINE_REG_EXP.test(first_child.getTextContent()))
	)
}
