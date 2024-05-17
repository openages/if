import { $findMatchingParent } from '@lexical/utils'

import { $isTableNode } from './index'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode) => {
	const table_node = $findMatchingParent(node, $isTableNode)

	return $isTableNode(table_node) ? table_node : null
}
