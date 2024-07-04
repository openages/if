import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { mermaidRender } from '@/Editor/utils'

import { $createMermaidNode, convertMermaidElement } from '../utils'
import styles from './index.css'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { IPropsMermaid } from '../types'
import type { SerializedMermaidNode } from '../types'

const Component = lazy(() => import('./Component'))

export default class MermaidNode extends DecoratorNode<JSX.Element> {
	__value: string

	constructor(props: IPropsMermaid) {
		super(props.node_key)

		const { value } = props

		this.__value = value
	}

	static getType() {
		return 'mermaid'
	}

	static clone(node: MermaidNode) {
		return new MermaidNode({ value: node.__value, node_key: node.__key })
	}

	static importDOM(): DOMConversionMap | null {
		return {
			div: dom => {
				if (!dom.hasAttribute('lexical-mermaid-value')) return null

				return {
					conversion: convertMermaidElement,
					priority: 0
				}
			},
			span: dom => {
				if (!dom.hasAttribute('lexical-mermaid-value')) return null

				return {
					conversion: convertMermaidElement,
					priority: 0
				}
			}
		}
	}

	static importJSON(serializedNode: SerializedMermaidNode) {
		return $createMermaidNode(serializedNode)
	}

	createDOM() {
		const el = document.createElement('p')

		el.classList.value = `__editor_mermaid  __editor_block __editor_block_special ${styles._local}`

		el.style.display = 'flex'
		el.style.paddingBlockStart = '0'
		el.style.paddingBlockEnd = '0'
		el.style.marginBlockStart = 'var(--editor_padding_y)'
		el.style.marginBlockEnd = 'var(--editor_padding_y)'

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('div')

		element.setAttribute('lexical-mermaid-value', btoa(this.__value))

		mermaidRender(this.__value, element)

		return { element }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return { type: 'mermaid', value: this.__value } as SerializedMermaidNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component value={this.__value} node_key={this.__key} />
			</Suspense>
		)
	}
}
