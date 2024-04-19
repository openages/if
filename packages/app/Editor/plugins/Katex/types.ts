import type { SerializedLexicalNode, Spread } from 'lexical'

import type KatexNode from './Node'

export interface IPropsKatex {
	value: string
	inline?: boolean
	node_key?: string
}

export interface IPropsComponent extends IPropsKatex {
	node: KatexNode
}

export interface IPropsRender extends IPropsKatex {
	onClick?: () => void
}

export type SerializedKatexNode = Spread<IPropsKatex, SerializedLexicalNode>
