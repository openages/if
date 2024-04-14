import type { NodeKey, SerializedLexicalNode, Spread } from 'lexical'

export interface IPropsImage {
	src: string
	width?: number | string
	height?: number | string
	alt?: string
	node_key?: NodeKey
}

export interface IPropsLazyImage extends IPropsImage {
	setRef: (v: HTMLImageElement) => void
}

export type SerializedImageNode = Spread<
	{
		src: string
		width?: number | string
		height?: number | string
		alt?: string
	},
	SerializedLexicalNode
>
