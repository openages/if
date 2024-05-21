import { ElementNode } from 'lexical'

import { $convertTableRowElement, $createTableRowNode } from './utils'

import type { DOMConversionMap, NodeKey } from 'lexical'

export default class TableRowNode extends ElementNode {
	constructor(key?: NodeKey) {
		super(key)
	}

	static getType(): string {
		return 'table_row'
	}

	static clone(node: TableRowNode) {
		return new TableRowNode(node.__key)
	}

	static importDOM(): DOMConversionMap {
		return { tr: () => ({ conversion: $convertTableRowElement, priority: 0 }) }
	}

	static importJSON() {
		return $createTableRowNode()
	}

	createDOM() {
		const el = document.createElement('tr')

		el.className = '__editor_table_tr'

		return el
	}

	exportJSON() {
		return { ...super.exportJSON(), type: 'table_row' }
	}

	isShadowRoot() {
		return true
	}

	updateDOM() {
		return false
	}

	canBeEmpty() {
		return false
	}

	canIndent() {
		return false
	}
}
