import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createDividerNode, convertDividerElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { SerializedDividerNode } from '../types'

const Component = lazy(() => import('./Component'))

export default class DividerNode extends DecoratorNode<JSX.Element> {
	constructor(key?: string) {
		super(key)
	}

	static getType() {
		return 'divider'
	}

	static clone(node: DividerNode) {
		return new DividerNode(node.__key)
	}

	static importDOM(): DOMConversionMap | null {
		return { hr: () => ({ conversion: convertDividerElement, priority: 0 }) }
	}

	static importJSON() {
		return $createDividerNode()
	}

	createDOM() {
		const el = document.createElement('p')

		el.className = '__editor_divider'

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('hr')

		return { element }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return { type: 'divider' } as SerializedDividerNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component node={this} node_key={this.__key} />
			</Suspense>
		)
	}
}
