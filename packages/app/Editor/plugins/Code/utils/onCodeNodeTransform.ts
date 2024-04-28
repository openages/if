import { $getNodeByKey } from 'lexical'

import { highlighter } from '@/utils'

import { $isCodeNode, getDiffRange, getHighlightNodes, updateAndRetainSelection } from './index'

import type { LexicalEditor } from 'lexical'
import type CodeNode from '../CodeNode'

const nodes_currently_highlighting = new Set()

export default (node: CodeNode, editor: LexicalEditor) => {
	const node_key = node.getKey()

	if (nodes_currently_highlighting.has(node_key)) return

	nodes_currently_highlighting.add(node_key)

	editor.update(
		() => {
			updateAndRetainSelection(node_key, () => {
				const current_node = $getNodeByKey(node_key) as CodeNode

				if (!$isCodeNode(current_node) || !current_node.isAttached()) return false

				const code = current_node.getTextContent()

				const { tokens } = highlighter.codeToTokens(code, {
					lang: current_node.__lang as any,
					theme: 'github-light'
				})

				const highlight_nodes = getHighlightNodes(tokens as any)
				const diff_range = getDiffRange(current_node.getChildren(), highlight_nodes)

				const { from, to, nodes_for_replacement } = diff_range

				if (from !== to || nodes_for_replacement.length) {
					node.splice(from, to - from, nodes_for_replacement)

					return true
				}

				return false
			})
		},
		{
			skipTransforms: true,
			onUpdate: () => {
				nodes_currently_highlighting.delete(node_key)
			}
		}
	)
}
