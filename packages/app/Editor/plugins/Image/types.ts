import type { LexicalEditor, NodeKey, SerializedEditor, SerializedLexicalNode, Spread } from 'lexical'

export interface IPropsImage {
	src: string
	altText: string
	showCaption?: boolean
	width?: number | string
	height?: number | string
	maxWidth?: number
	caption?: LexicalEditor
	nodeKey?: NodeKey
}

export interface IPropsLazyImage extends IPropsImage {
	className?: string
	setRef: (v: HTMLImageElement) => void
}

export type SerializedImageNode = Spread<
	{
		altText: string
		caption: SerializedEditor
		maxWidth: number
		showCaption: boolean
		src: string
		width?: number
		height?: number
	},
	SerializedLexicalNode
>
