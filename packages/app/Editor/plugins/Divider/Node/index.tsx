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

	static importJSON() {
		return $createDividerNode()
	}

	static importDOM(): DOMConversionMap | null {
		return { hr: () => ({ conversion: convertDividerElement, priority: 0 }) }
	}

	exportJSON() {
		return { type: 'divider' } as SerializedDividerNode
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

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component node={this} node_key={this.__key} />
			</Suspense>
		)
	}
}
