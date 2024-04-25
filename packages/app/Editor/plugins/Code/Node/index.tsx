import { DecoratorNode } from 'lexical'
import { lazy, Suspense } from 'react'

import { $createCodeNode, convertCodeElement } from '../utils'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { IPropsCode } from '../types'
import type { SerializedCodeNode } from '../types'
import type { BundledLanguage } from 'shiki'

const Component = lazy(() => import('./Component'))

export default class CodeNode extends DecoratorNode<JSX.Element> {
	__value: string
	__lang: BundledLanguage

	constructor(props: IPropsCode) {
		super()

		const { value, lang } = props

		this.__value = value
		this.__lang = lang || 'js'
	}

	static getType() {
		return 'code'
	}

	static clone(node: CodeNode) {
		return new CodeNode({ value: node.__value, lang: node.__lang })
	}

	static importJSON(serializedNode: SerializedCodeNode) {
		return $createCodeNode(serializedNode)
	}

	static importDOM(): DOMConversionMap | null {
		return { code: _ => ({ conversion: convertCodeElement, priority: 0 }) }
	}

	exportJSON() {
		return {
			type: 'code',
			value: this.__value,
			lang: this.__lang
		} as SerializedCodeNode
	}

	createDOM() {
		return document.createElement('p')
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('code')

		element.setAttribute('data-lexical-code', btoa(this.__value))
		element.setAttribute('data-lexical-lang', this.__lang)

		return { element }
	}

	updateDOM() {
		return false
	}

	decorate() {
		return (
			<Suspense fallback={null}>
				<Component value={this.__value} lang={this.__lang} node={this} node_key={this.__key} />
			</Suspense>
		)
	}
}
