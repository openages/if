import KatexNode from '@/Editor/plugins/Katex/Node'
import { $createKatexNode, $isKatexNode } from '@/Editor/plugins/Katex/utils'
import { insertBlock } from '@/Editor/utils'

import type { TextMatchTransformer, ElementTransformer } from '@lexical/markdown'

export const Katex_inline = {
	type: 'text-match',
	regExp: /(?<!\$)\$\s*([^$]+?)\s*\$$/,
	importRegExp: /(?<!\$)\$\s*([^$]+?)\s*\$/,
	trigger: '$',
	dependencies: [KatexNode],
	export(node: KatexNode) {
		if (!$isKatexNode(node)) return null

		return `$ ${node.__value} $`
	},
	replace(node, match) {
		const [, value] = match

		node.replace($createKatexNode({ value, inline: true }))
	}
} as TextMatchTransformer

export const Katex_block = {
	type: 'element',
	regExp: /^\$\$\s*([^$]+?)\s*\$\$?\s$/,
	dependencies: [KatexNode],
	export(node: KatexNode) {
		if (!$isKatexNode(node)) return null

		return `$$ ${node.__value} $$`
	},
	replace(_parent, _children, match, _is_import) {
		const node = $createKatexNode({ value: match[1], inline: false })

		insertBlock(node)
	}
} as ElementTransformer
