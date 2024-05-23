import { $findMatchingParent } from '@lexical/utils'

import type { LexicalNode } from 'lexical'

export default (node: LexicalNode, findFn: (n: LexicalNode) => boolean) => {
	const target = $findMatchingParent(node, findFn)

	return findFn(target) ? target : null
}
