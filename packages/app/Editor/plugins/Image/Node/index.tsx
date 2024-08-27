import type { SerializedImageNode } from '../types'

import { $setImportNode, DecoratorNode } from 'lexical'
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
	__inline: boolean

	constructor(props: IPropsImage) {
		super(props.node_key)

		const { src, width, height, alt, align, object_fit, inline } = props

		this.__src = src!
		this.__width = width!
		this.__height = height!
		this.__alt = alt!
		this.__align = align || 'center'
		this.__object_fit = object_fit
		this.__inline = inline!
	}

	static getType() {
		return 'image'
	}

	static clone(node: ImageNode, new_key?: boolean) {
		return new ImageNode({
			src: node.__src,
			width: node.__width,
			height: node.__height,
			alt: node.__alt,
			align: node.__align,
			object_fit: node.__object_fit,
			inline: node.__inline,
			node_key: new_key ? undefined : node.__key
		})
	}

	static importDOM(): DOMConversionMap {
		return { img: () => ({ conversion: convertImageElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedImageNode, update?: boolean) {
		const node = $createImageNode(serializedNode)

		if (!update) $setImportNode(serializedNode.node_key!, node)

		return node
	}

	createDOM() {
		const el = document.createElement(this.__inline ? 'span' : 'p')

		if (this.__inline) {
			el.style.display = 'inline-block'
			el.style.lineHeight = '1'
			el.style.paddingInlineStart = '2px'
			el.style.paddingInlineEnd = '2px'
		}

		return el
	}

	exportDOM(): DOMExportOutput {
		const el = document.createElement('img')

		const width = typeof this.__width === 'number' ? this.__width.toString() + 'px' : this.__width
		const height = typeof this.__height === 'number' ? this.__height.toString() + 'px' : this.__height

		el.setAttribute('src', this.__src)
		el.setAttribute('width', width)
		el.setAttribute('height', height)
		el.setAttribute('alt', this.__alt)

		return { element: el }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return {
			type: 'image',
			node_key: this.__key,
			src: this.__src,
			width: this.__width,
			height: this.__height,
			alt: this.__alt,
			inline: this.__inline
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
					inline={this.__inline}
					node_key={this.__key}
				/>
			</Suspense>
		)
	}
}
