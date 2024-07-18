import type { Klass, LexicalNode, Transform, LexicalEditor, DOMExportOutput } from 'lexical'
import type { IPropsUpdater } from './plugins/_Updater_/types'
import type { IPropsLinkEditor } from './plugins/LinkEditor/types'

export interface IPropsModal {
	node_key?: string
	onClose: () => void
}

export interface IPropsCommon {
	md?: boolean
}

export interface RegisteredNode {
	transforms: Set<Transform<LexicalNode>>
	klass: Klass<LexicalNode>
	replaceWithKlass: null | Klass<LexicalNode>
	replace: null | ((node: LexicalNode) => LexicalNode)
	exportDOM?: (editor: LexicalEditor, targetNode: LexicalNode) => DOMExportOutput
}

export type RegisteredNodes = Map<string, RegisteredNode>

export interface InternalSerializedNode {
	type: string
	version: number
	children?: Array<InternalSerializedNode>
}

export interface IPropsText extends IPropsUpdater, IPropsLinkEditor {
	id?: HTMLDivElement['id']
	className?: HTMLDivElement['className']
	placeholder?: string
	placeholder_classname?: HTMLDivElement['className']
	setRef?: (v: HTMLDivElement) => void
}
