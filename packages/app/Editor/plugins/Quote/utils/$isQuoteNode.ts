import Node from '../QuoteNode'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	return node instanceof Node
}
