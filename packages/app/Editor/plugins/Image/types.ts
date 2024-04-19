import type { SerializedLexicalNode, Spread } from 'lexical'

import type ImageNode from './Node'
import type { CSSProperties } from 'react'

export interface IPropsImage {
	src: string
	width?: number | string
	height?: number | string
	alt?: string
	align?: CSSProperties['justifyContent']
	object_fit?: CSSProperties['objectFit']
	node_key?: string
}

export interface IPropsComponent extends IPropsImage {
	node: ImageNode
}

export type SerializedImageNode = Spread<IPropsImage, SerializedLexicalNode>
