import TableRowNode from '../TableRowNode'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	return node instanceof TableRowNode
}
