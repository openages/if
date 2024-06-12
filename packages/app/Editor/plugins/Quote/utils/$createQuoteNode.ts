import { $applyNodeReplacement, $createParagraphNode } from 'lexical'

import QuoteNode from '../QuoteNode'

export default () => {
	const node = new QuoteNode()
	const p = $createParagraphNode()

	node.append(p)

	return $applyNodeReplacement(node) as QuoteNode
}
