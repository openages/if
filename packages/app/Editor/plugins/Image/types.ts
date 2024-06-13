import type { SerializedLexicalNode, Spread } from 'lexical'

import type { CSSProperties } from 'react'

export interface IPropsImage {
	src: string
	width?: number | string
	height?: number | string
	alt?: string
	align?: CSSProperties['justifyContent']
	object_fit?: CSSProperties['objectFit']
	inline?: boolean
	node_key?: string
}

export type SerializedImageNode = Spread<IPropsImage, SerializedLexicalNode>
