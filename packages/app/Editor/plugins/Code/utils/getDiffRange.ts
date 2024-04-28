import { $isLineBreakNode, $isTabNode } from 'lexical'

import CodeTextNode from '../CodeTextNode'
import { $isCodeTextNode } from './index'

import type { LexicalNode } from 'lexical'

const isEqual = (node_a: LexicalNode, node_b: LexicalNode) => {
	return (
		($isCodeTextNode(node_a) &&
			$isCodeTextNode(node_b) &&
			(node_a as CodeTextNode).__text === (node_b as CodeTextNode).__text &&
			(node_a as CodeTextNode).__color === (node_b as CodeTextNode).__color) ||
		($isTabNode(node_a) && $isTabNode(node_b)) ||
		($isLineBreakNode(node_a) && $isLineBreakNode(node_b))
	)
}

export default (prev_nodes: Array<LexicalNode>, next_nodes: Array<LexicalNode>) => {
	let leading_match = 0

	while (leading_match < prev_nodes.length) {
		if (!isEqual(prev_nodes[leading_match], next_nodes[leading_match])) {
			break
		}

		leading_match++
	}

	const prev_nodes_length = prev_nodes.length
	const next_nodes_length = next_nodes.length
	const max_trailing_match = Math.min(prev_nodes_length, next_nodes_length) - leading_match

	let trailing_match = 0

	while (trailing_match < max_trailing_match) {
		trailing_match++

		if (
			!isEqual(
				prev_nodes[prev_nodes_length - trailing_match],
				next_nodes[next_nodes_length - trailing_match]
			)
		) {
			trailing_match--

			break
		}
	}

	const from = leading_match
	const to = prev_nodes_length - trailing_match
	const nodes_for_replacement = next_nodes.slice(leading_match, next_nodes_length - trailing_match)

	return { from, to, nodes_for_replacement }
}
