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
		super(props.node_key)

		const { value, inline } = props

		this.__value = value
		this.__inline = inline
	}

	static getType() {
		return 'katex'
	}

	static clone(node: KatexNode) {
		return new KatexNode({ value: node.__value, inline: node.__inline, node_key: node.__key })
	}

	static importDOM(): DOMConversionMap | null {
		return {
			div: dom => {
				if (!dom.hasAttribute('lexical-katex-value')) return null

				return {
					conversion: convertKatexElement,
					priority: 0
				}
			},
			span: dom => {
				if (!dom.hasAttribute('lexical-katex-value')) return null

				return {
					conversion: convertKatexElement,
					priority: 0
				}
			}
		}
	}

	static importJSON(serializedNode: SerializedKatexNode) {
		return $createKatexNode(serializedNode)
	}

	createDOM() {
		const el = document.createElement('span')

		el.className = '__editor_katex'

		if (!this.__inline) {
			el.style.display = 'inline-flex'
			el.style.width = '100%'
			el.style.justifyContent = 'center'
			el.style.paddingTop = '1em'
			el.style.paddingBottom = '1em'
		}

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement(this.__inline ? 'span' : 'div')

		element.setAttribute('lexical-katex-value', btoa(this.__value))
		element.setAttribute('lexical-katex-inline', `${this.__inline}`)

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

	updateDOM() {
		return false
	}

	exportJSON() {
		return {
			type: 'katex',
			value: this.__value,
			inline: this.__inline
		} as SerializedKatexNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component value={this.__value} node={this} node_key={this.__key} />
			</Suspense>
		)
	}
}
