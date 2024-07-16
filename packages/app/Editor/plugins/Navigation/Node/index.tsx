import { $setImportNode, DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { TableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin'

import { $createNavigationNode, convertNavigationElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput, SerializedLexicalNode } from 'lexical'
import type { TableOfContentsEntry } from '@lexical/react/LexicalTableOfContentsPlugin'
import type { SerializedNavigationNode } from './types'

const Component = lazy(() => import('./Component'))

export default class NavigationNode extends DecoratorNode<JSX.Element> {
	__items: Array<TableOfContentsEntry>

	constructor(key?: string) {
		super(key)
	}

	static getType() {
		return 'navigation'
	}

	static clone(node: NavigationNode) {
		return new NavigationNode(node.__key)
	}

	static importDOM(): DOMConversionMap {
		return { div: () => ({ conversion: convertNavigationElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedNavigationNode, update?: boolean) {
		const node = $createNavigationNode(serializedNode.node_key)

		if (!update) $setImportNode(serializedNode.node_key, node)

		return node
	}

	createDOM() {
		const el = document.createElement('div')

		el.classList.value = '__editor_navigation'

		return el
	}

	exportDOM(): DOMExportOutput {
		const el = document.createElement('div')

		el.setAttribute('lexical-navigation', 'true')

		return { element: el }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return { type: 'navigation', node_key: this.__key } as SerializedNavigationNode
	}

	decorate() {
		return (
			<TableOfContentsPlugin>
				{items => (
					<Suspense fallback={null}>
						<Component items={items} node_key={this.__key} />
					</Suspense>
				)}
			</TableOfContentsPlugin>
		)
	}
}
