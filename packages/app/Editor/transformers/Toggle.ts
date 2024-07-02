import { $convertToMarkdownString } from '@lexical/markdown'

import ToggleNode from '../plugins/Toggle/ToggleNode'
import { $isToggleNode } from '../plugins/Toggle/utils'
import transformers from './'

import type { ElementTransformer } from '@lexical/markdown'
import type ToggleHeadNode from '../plugins/Toggle/ToggleHeadNode'
import type ToggleBodyNode from '../plugins/Toggle/ToggleBodyNode'

export default {
	type: 'element',
	regExp: new RegExp(''),
	dependencies: [ToggleNode],
	export(node: ToggleNode) {
		if (!$isToggleNode(node)) return

		const [_, head_node, body_node] = node.getChildren()

		const head_node_text = $convertToMarkdownString(transformers, head_node as ToggleHeadNode, true)
		const body_node_text = $convertToMarkdownString(transformers, body_node as ToggleBodyNode, false)

		return `<details>
<summary>${head_node_text}</summary>
${body_node_text}
</details>`
	},
	replace() {
		return null
	}
} as ElementTransformer
