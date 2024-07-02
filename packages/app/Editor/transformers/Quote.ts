import { $createLineBreakNode } from 'lexical'

import { $convertToMarkdownString } from '@lexical/markdown'

import QuoteNode from '../plugins/Quote/QuoteNode'
import { $createQuoteNode, $isQuoteNode } from '../plugins/Quote/utils'
import transformers from './'

import type { ElementTransformer } from '@lexical/markdown'

export default {
	type: 'element',
	regExp: /^>\s/,
	dependencies: [QuoteNode],
	export(node: QuoteNode, exportChildren) {
		if (!$isQuoteNode(node)) return null

		const res = $convertToMarkdownString(transformers, node, true)

		const lines = res.split('\n')
		const output = []

		for (const line of lines) {
			output.push('> ' + line)
		}

		return output.join('\n')
	},
	replace(parent, children, _match, is_import) {
		if (is_import) {
			const prev_node = parent.getPreviousSibling() as QuoteNode

			if ($isQuoteNode(prev_node)) {
				prev_node.splice(prev_node.getChildrenSize(), 0, [$createLineBreakNode(), ...children])
				prev_node.select(0, 0)

				parent.remove()

				return
			}
		}

		const node = $createQuoteNode()

		node.append(...children)
		parent.replace(node)

		node.select(0, 0)
	}
} as ElementTransformer
