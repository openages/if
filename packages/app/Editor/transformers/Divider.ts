import DividerNode from '../plugins/Divider/Node'
import { $createDividerNode, $isDividerNode } from '../plugins/Divider/utils'

import type { ElementTransformer } from '@lexical/markdown'

export default {
	type: 'element',
	regExp: /^(---|\*\*\*|___)\s?$/,
	dependencies: [DividerNode],
	export(node) {
		return $isDividerNode(node) ? '***' : null
	},
	replace(parent, _children, _match, is_import) {
		const line = $createDividerNode()

		if (is_import || parent.getNextSibling() !== null) {
			parent.replace(line)
		} else {
			parent.insertBefore(line)
		}

		line.selectNext()
	}
} as ElementTransformer
