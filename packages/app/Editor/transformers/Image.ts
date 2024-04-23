import ImageNode from '@/Editor/plugins/Image/Node'
import { $createImageNode, $isImageNode } from '@/Editor/plugins/Image/utils'

import type { TextMatchTransformer } from '@lexical/markdown'

export default {
	type: 'text-match',
	regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
	importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
	trigger: ')',
	dependencies: [ImageNode],
	export(node: ImageNode) {
		if (!$isImageNode(node)) return null

		return `![${node.__alt}](${node.__src})`
	},
	replace(node, match) {
		const [, alt, src] = match

		node.replace($createImageNode({ src, alt }))
	}
} as TextMatchTransformer
