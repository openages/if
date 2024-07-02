import MermaidNode from '../plugins/Mermaid/Node'
import { $isMermaidNode } from '../plugins/Mermaid/utils'

import type { ElementTransformer } from '@lexical/markdown'

export default {
	type: 'element',
	regExp: new RegExp(''),
	dependencies: [MermaidNode],
	export(node: MermaidNode) {
		if (!$isMermaidNode(node)) return

		return `\`\`\`mermaid
${node.__value}
\`\`\``
	},
	replace() {
		return null
	}
} as ElementTransformer
