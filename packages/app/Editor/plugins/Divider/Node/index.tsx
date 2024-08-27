import { $setImportNode, DecoratorNode } from 'lexical'
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

	static clone(node: DividerNode, new_key?: boolean) {
		return new DividerNode(new_key ? undefined : node.__key)
	}

	static importDOM(): DOMConversionMap | null {
		return { hr: () => ({ conversion: convertDividerElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedDividerNode, update?: boolean) {
		const node = $createDividerNode(serializedNode.node_key)

		if (!update) $setImportNode(serializedNode.node_key!, node)

		return node
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
		return { type: 'divider', node_key: this.__key } as SerializedDividerNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component node_key={this.__key} />
			</Suspense>
		)
	}
}
