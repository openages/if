import katex from 'katex'
import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createKatexNode, convertKatexElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { IPropsKatex } from '../types'
import type { SerializedKatexNode } from '../types'

const Component = lazy(() => import('./Component'))

export default class KatexNode extends DecoratorNode<JSX.Element> {
	__value: string
	__inline: boolean

	constructor(props: IPropsKatex) {
		super()

		const { value, inline } = props

		this.__value = value
		this.__inline = inline
	}

	static getType() {
		return 'katex'
	}

	static clone(node: KatexNode) {
		return new KatexNode({ value: node.__value, inline: node.__inline })
	}

	static importJSON(serializedNode: SerializedKatexNode) {
		return $createKatexNode(serializedNode)
	}

	static importDOM(): DOMConversionMap | null {
		return {
			div: dom => {
				if (!dom.hasAttribute('data-lexical-katex')) return null

				return {
					conversion: convertKatexElement,
					priority: 2
				}
			},
			span: dom => {
				if (!dom.hasAttribute('data-lexical-katex')) return null

				return {
					conversion: convertKatexElement,
					priority: 1
				}
			}
		}
	}

	exportJSON() {
		return {
			type: 'katex',
			value: this.__value,
			inline: this.__inline
		} as SerializedKatexNode
	}

	createDOM() {
		const el = document.createElement('span')

		if (!this.__inline) {
			el.style.display = 'inline-flex'

			el.style.width = '100%'
			el.style.justifyContent = 'center'
			el.style.paddingTop = '0.6em'
		}

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement(this.__inline ? 'span' : 'div')

		element.setAttribute('data-lexical-katex', btoa(this.__value))
		element.setAttribute('data-lexical-inline', `${this.__inline}`)

		katex.render(this.__value, element, {
			displayMode: !this.__inline,
			errorColor: '#cc0000',
			output: 'html',
			strict: 'warn',
			throwOnError: false,
			trust: false
		})

		return { element }
	}

	updateDOM(update?: boolean) {
		return update ?? false
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component value={this.__value} node={this} node_key={this.__key} />
			</Suspense>
		)
	}
}
