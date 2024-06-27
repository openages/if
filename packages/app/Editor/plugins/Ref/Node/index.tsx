import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createRefNode, convertRefElement } from '../utils'
import styles from './index.css'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { IPropsRef, SerializedRefNode } from '../types'

const Component = lazy(() => import('./Component'))

export default class RefNode extends DecoratorNode<JSX.Element> {
	__module: IPropsRef['module']
	__id: string

	constructor(props: IPropsRef) {
		super(props.node_key)

		const { module, id } = props

		this.__module = module
		this.__id = id
	}

	static getType() {
		return 'ref'
	}

	static clone(node: RefNode) {
		return new RefNode({ module: node.__module as IPropsRef['module'], id: node.__id, node_key: node.__key })
	}

	static importDOM(): DOMConversionMap | null {
		return { span: _ => ({ conversion: convertRefElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedRefNode) {
		return $createRefNode(serializedNode)
	}

	createDOM() {
		const el = document.createElement('span')

		el.classList.add('__editor_ref', styles._local)

		return el
	}

	exportDOM(): DOMExportOutput {
		const el = document.createElement('div')

		el.setAttribute('lexical-ref-module', this.__module)
		el.setAttribute('lexical-ref-id', this.__id)

		return { element: el }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return { type: 'ref', module: this.__module, id: this.__id } as SerializedRefNode
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component module={this.__module} id={this.__id} node_key={this.__key} />
			</Suspense>
		)
	}
}
