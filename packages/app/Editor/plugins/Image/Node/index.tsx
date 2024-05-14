import type { SerializedImageNode } from '../types'

import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createImageNode, convertImageElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { IPropsImage } from '../types'
import type { CSSProperties } from 'react'

const Component = lazy(() => import('./Component'))

export default class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string
	__width: number | string
	__height: number | string
	__alt: string
	__align: CSSProperties['justifyContent']
	__object_fit: CSSProperties['objectFit']

	constructor(props: IPropsImage) {
		super(props.node_key)

		const { src, width, height, alt, align, object_fit } = props

		this.__src = src
		this.__width = width
		this.__height = height
		this.__alt = alt
		this.__align = align || 'center'
		this.__object_fit = object_fit
	}

	static getType() {
		return 'image'
	}

	static clone(node: ImageNode) {
		return new ImageNode({
			src: node.__src,
			width: node.__width,
			height: node.__height,
			alt: node.__alt,
			align: node.__align,
			object_fit: node.__object_fit,
			node_key: node.__key
		})
	}

	static importDOM(): DOMConversionMap {
		return { img: () => ({ conversion: convertImageElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedImageNode) {
		return $createImageNode(serializedNode)
	}

	createDOM() {
		const el = document.createElement('span')

		el.style.display = 'inline-flex'
		el.style.width = '100%'
		el.style.caretColor = 'transparent'

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('img')

		const width = typeof this.__width === 'number' ? this.__width.toString() + 'px' : this.__width
		const height = typeof this.__height === 'number' ? this.__height.toString() + 'px' : this.__height

		element.setAttribute('src', this.__src)
		element.setAttribute('width', width)
		element.setAttribute('height', height)
		element.setAttribute('alt', this.__alt)

		return { element }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return {
			type: 'image',
			src: this.__src,
			width: this.__width,
			height: this.__height,
			alt: this.__alt
		} as SerializedImageNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component
					src={this.__src}
					width={this.__width}
					height={this.__height}
					alt={this.__alt}
					align={this.__align}
					object_fit={this.__object_fit}
					node={this}
					node_key={this.__key}
				/>
			</Suspense>
		)
	}
}
