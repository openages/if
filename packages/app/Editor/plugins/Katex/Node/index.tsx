import katex from 'katex'
import { $setImportNode, DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createKatexNode, convertKatexElement } from '../utils'
import styles from './index.css'

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
		this.__inline = inline!
	}

	static getType() {
		return 'katex'
	}

	static clone(node: KatexNode, new_key?: boolean) {
		return new KatexNode({
			value: node.__value,
			inline: node.__inline,
			node_key: new_key ? undefined : node.__key
		})
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

	static importJSON(serializedNode: SerializedKatexNode, update?: boolean) {
		const node = $createKatexNode(serializedNode)

		if (!update) $setImportNode(serializedNode.node_key!, node)

		return node
	}

	createDOM() {
		const el = document.createElement(this.__inline ? 'span' : 'p')

		el.classList.add('__editor_katex', styles._local)

		if (!this.__inline) {
			el.classList.add('__editor_block')
			el.classList.remove(styles.inline)

			el.style.display = 'flex'
			el.style.justifyContent = 'center'
		} else {
			el.classList.add(styles.inline)

			el.style.display = 'inline-block'
			el.style.justifyContent = 'unset'
			el.style.paddingTop = 'unset'
			el.style.paddingBottom = 'unset'
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

	updateDOM(prev: KatexNode) {
		if (prev.__inline !== this.__inline) {
			return true
		}

		return false
	}

	exportJSON() {
		return {
			type: 'katex',
			node_key: this.__key,
			value: this.__value,
			inline: this.__inline
		} as SerializedKatexNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component value={this.__value} node_key={this.__key} />
			</Suspense>
		)
	}
}
