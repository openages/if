import type { SerializedLexicalNode, Spread } from 'lexical'

import type DividerNode from './Node'

export interface IPropsComponent {
	node_key: string
	node: DividerNode
}

export type SerializedDividerNode = Spread<{}, SerializedLexicalNode>
