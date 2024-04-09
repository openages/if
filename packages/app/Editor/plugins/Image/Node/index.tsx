import type { SerializedImageNode } from '../types'

import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createImageNode, convertImageElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput, EditorConfig, LexicalEditor, NodeKey } from 'lexical'

const ImageComponent = lazy(() => import('./Content'))

export default class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string
	__altText: string
	__width: 'inherit' | number
	__height: 'inherit' | number
	__maxWidth: number
	__showCaption: boolean
	__caption: LexicalEditor

	static getType(): string {
		return 'image'
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(
			node.__src,
			node.__altText,
			node.__maxWidth,
			node.__width,
			node.__height,
			node.__showCaption,
			node.__caption,
			node.__key
		)
	}

	static importJSON(serializedNode: SerializedImageNode): ImageNode {
		const { altText, height, width, maxWidth, caption, src, showCaption } = serializedNode

		const node = $createImageNode({
			altText,
			height,
			maxWidth,
			showCaption,
			src,
			width
		}) as ImageNode

		const nestedEditor = node.__caption
		const editorState = nestedEditor.parseEditorState(caption.editorState)

		if (!editorState.isEmpty()) {
			nestedEditor.setEditorState(editorState)
		}

		return node
	}

	static importDOM(): DOMConversionMap | null {
		return { img: () => ({ conversion: convertImageElement, priority: 0 }) }
	}

	constructor(
		src: string,
		altText: string,
		maxWidth: number,
		width?: 'inherit' | number,
		height?: 'inherit' | number,
		showCaption?: boolean,
		caption?: LexicalEditor,
		key?: NodeKey
	) {
		super(key)

		this.__src = src
		this.__altText = altText
		this.__maxWidth = maxWidth
		this.__width = width || 'inherit'
		this.__height = height || 'inherit'
		this.__showCaption = showCaption || false
		this.__caption = caption
	}

	exportJSON() {
		return {
			altText: this.getAltText(),
			caption: this.__caption.toJSON(),
			height: this.__height === 'inherit' ? 0 : this.__height,
			maxWidth: this.__maxWidth,
			showCaption: this.__showCaption,
			src: this.getSrc(),
			type: 'image',
			version: 1,
			width: this.__width === 'inherit' ? 0 : this.__width
		} as SerializedImageNode
	}

	setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number) {
		const writable = this.getWritable()

		writable.__width = width
		writable.__height = height
	}

	setShowCaption(showCaption: boolean) {
		const writable = this.getWritable()

		writable.__showCaption = showCaption
	}

	createDOM(config: EditorConfig) {
		const span = document.createElement('span')
		const theme = config.theme
		const className = theme.image

		if (className !== undefined) {
			span.className = className
		}

		return span
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('img')

		element.setAttribute('src', this.__src)
		element.setAttribute('alt', this.__altText)
		element.setAttribute('width', this.__width.toString())
		element.setAttribute('height', this.__height.toString())

		return { element }
	}

	updateDOM() {
		return false
	}

	getSrc() {
		return this.__src
	}

	getAltText() {
		return this.__altText
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<ImageComponent
					src={this.__src}
					altText={this.__altText}
					width={this.__width}
					height={this.__height}
					maxWidth={this.__maxWidth}
					nodeKey={this.getKey()}
					showCaption={this.__showCaption}
					caption={this.__caption}
				/>
			</Suspense>
		)
	}
}
