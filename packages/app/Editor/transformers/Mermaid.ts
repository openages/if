import MermaidNode from '../plugins/Mermaid/Node'
import { $isMermaidNode } from '../plugins/Mermaid/utils'

import type { ElementTransformer } from '@lexical/markdown'
import type { LexicalNode } from 'lexical'

export default {
	type: 'element',
	regExp: new RegExp(''),
	dependencies: [MermaidNode],
	export(node: LexicalNode) {
		if (!$isMermaidNode(node)) return

		return `\`\`\`mermaid
${(node as MermaidNode).__value}
\`\`\``
	},
	replace() {
		return null
	}
} as ElementTransformer
