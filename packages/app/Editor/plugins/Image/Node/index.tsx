import type { SerializedImageNode } from '../types'

import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createImageNode, convertImageElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput, EditorConfig } from 'lexical'

const Component = lazy(() => import('./Component'))

export default class ImageNode extends DecoratorNode<JSX.Element> {
	src: string
	width: number | string
	height: number | string
	alt: string

	static getType(): string {
		return 'image'
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(node.src, node.width, node.height, node.alt)
	}

	static importJSON(serializedNode: SerializedImageNode): ImageNode {
		const { src, height, width, alt } = serializedNode

		const node = $createImageNode({
			src,
			width,
			height,
			alt
		}) as ImageNode

		return node
	}

	static importDOM(): DOMConversionMap | null {
		return { img: () => ({ conversion: convertImageElement, priority: 0 }) }
	}

	constructor(src: string, width?: number | string, height?: number | string, alt?: string) {
		super()

		this.src = src
		this.width = width
		this.height = height
		this.alt = alt
	}

	exportJSON() {
		return {
			type: 'image',
			version: 1,
			src: this.src,
			width: this.width,
			height: this.height,
			alt: this.alt
		} as SerializedImageNode
	}

	setWidthAndHeight(width: number | string, height: number | string) {
		const writable = this.getWritable()

		writable.width = width
		writable.height = height
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

		element.setAttribute('src', this.src)
		element.setAttribute('alt', this.alt)
		element.setAttribute('width', this.width.toString())
		element.setAttribute('height', this.height.toString())

		return { element }
	}

	updateDOM() {
		return false
	}

	getSrc() {
		return this.src
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component
					src={this.src}
					width={this.width}
					height={this.height}
					alt={this.alt}
					node_key={this.__key}
				/>
			</Suspense>
		)
	}
}
