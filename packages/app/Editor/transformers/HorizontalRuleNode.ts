import {
	$createHorizontalRuleNode,
	$isHorizontalRuleNode,
	HorizontalRuleNode
} from '@lexical/react/LexicalHorizontalRuleNode'

import type { ElementTransformer } from '@lexical/markdown'

export default {
	type: 'element',
	regExp: /^(---|\*\*\*|___)\s?$/,
	dependencies: [HorizontalRuleNode],
	export(node) {
		return $isHorizontalRuleNode(node) ? '***' : null
	},
	replace(parent, _children, _match, is_import) {
		const line = $createHorizontalRuleNode()

		if (is_import || parent.getNextSibling() != null) {
			parent.replace(line)
		} else {
			parent.insertBefore(line)
		}

		line.selectNext()
	}
} as ElementTransformer
