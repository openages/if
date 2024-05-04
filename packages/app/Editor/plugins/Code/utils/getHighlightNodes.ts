import { $createLineBreakNode, $createTabNode } from 'lexical'

import { $createCodeTextNode } from './index'

import type { ThemedToken } from 'shiki'
import type { LexicalNode } from 'lexical'

export default (tokens: Array<Array<ThemedToken>>) => {
	const nodes: Array<LexicalNode> = []

	tokens.forEach((line, index) => {
		line.forEach(token => {
			const { content, htmlStyle } = token

			if (content === '\t') {
				nodes.push($createTabNode())
			} else {
				nodes.push($createCodeTextNode({ text: content, color: htmlStyle }))
			}
		})

		if (tokens.at(index + 1)) {
			nodes.push($createLineBreakNode())
		}
	})

	return nodes
}
