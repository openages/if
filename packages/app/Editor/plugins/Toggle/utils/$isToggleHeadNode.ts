import Node from '../ToggleHeadNode'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode | null | undefined) => {
	return node instanceof Node
}
