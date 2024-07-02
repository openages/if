import { $createParagraphNode } from 'lexical'

import ImageNode from '@/Editor/plugins/Image/Node'
import { $createImageNode, $isImageNode } from '@/Editor/plugins/Image/utils'
import { insertBlock } from '@/Editor/utils'

import type { ElementTransformer, TextMatchTransformer } from '@lexical/markdown'

export const Image_text = {
	type: 'text-match',
	regExp: /^!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
	importRegExp: /^!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
	trigger: ')',
	dependencies: [ImageNode],
	export(node: ImageNode) {
		if (!$isImageNode(node)) return null

		return `![${node.__alt || 'img_alt'}](${node.__src})`
	},
	replace(node, match) {
		const [, alt, src] = match

		const parent = node.getParent()
		const target = $createImageNode({ src, alt })
		const p = $createParagraphNode()

		parent.replace(target)
		target.insertAfter(p)

		p.select()
	}
} as TextMatchTransformer

export const Image_element = {
	type: 'element',
	regExp: /^!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
	dependencies: [ImageNode],
	export(node: ImageNode) {
		if (!$isImageNode(node)) return null

		return `![${node.__alt || 'img_alt'}](${node.__src})`
	},
	replace(_parent, _children, match) {
		const [, alt, src] = match

		insertBlock($createImageNode({ src, alt }))
	}
} as ElementTransformer
