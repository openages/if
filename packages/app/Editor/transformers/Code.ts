import { getLangName, shiki_langs, CODE_BLOCK_REG_EXP } from '@/Editor/utils'

import CodeNode from '../plugins/Code/CodeNode'
import { $createCodeNode, $isCodeNode } from '../plugins/Code/utils'

import type { ElementTransformer } from '@lexical/markdown'
import type { BundledLanguage } from 'shiki'

export default {
	type: 'element',
	regExp: CODE_BLOCK_REG_EXP,
	dependencies: [CodeNode],
	export(node: CodeNode) {
		if (!$isCodeNode(node)) return null

		const text = node.getTextContent()

		return '```' + (node.__lang || '') + (text ? '\n' + text : '') + '\n' + '```'
	},
	replace(parent, _children, match) {
		const lang = (match ? match[1] : 'js') as BundledLanguage
		const target = getLangName(lang)

		if (!shiki_langs[target]) return

		const node = $createCodeNode({ lang: target as BundledLanguage })

		parent.replace(node)
	}
} as ElementTransformer
