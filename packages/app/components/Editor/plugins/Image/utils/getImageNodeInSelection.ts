import { $getSelection, $isNodeSelection } from 'lexical'

import { $isImageNode } from '../utils'

export default () => {
	const selection = $getSelection()

	if (!$isNodeSelection(selection)) return null

	const nodes = selection.getNodes()
	const node = nodes[0]

	return $isImageNode(node) ? node : null
}
