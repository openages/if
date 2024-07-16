import { useMemoizedFn } from 'ahooks'
import { $getNodeByKey, $setImportNode, DecoratorNode } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent } from '@lexical/utils'
import { CaretDown } from '@phosphor-icons/react'

import { $createToggleBtnNode, $isToggleNode, convertToggleBtnElement } from './utils'

import type { DOMConversionMap, DOMExportOutput } from 'lexical'
import type { SerializedLexicalNode } from 'lexical'
import type ToggleNode from './ToggleNode'

export default class ToggleBtnNode extends DecoratorNode<JSX.Element> {
	constructor(key?: string) {
		super(key)
	}

	static getType() {
		return 'toggle_btn'
	}

	static clone(node: ToggleBtnNode) {
		return new ToggleBtnNode(node.__key)
	}

	static importDOM(): DOMConversionMap | null {
		return { button: () => ({ conversion: convertToggleBtnElement, priority: 0 }) }
	}

	static importJSON(serializedNode: SerializedLexicalNode, update?: boolean) {
		const node = $createToggleBtnNode(serializedNode.key)

		if (!update) $setImportNode(serializedNode.key, node)

		return node
	}

	createDOM() {
		const el = document.createElement('button')

		el.classList.add('__editor_toggle_btn', 'absolute', 'clickable')

		return el
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('button')

		return { element }
	}

	updateDOM() {
		return false
	}

	exportJSON() {
		return { type: 'toggle_btn' } as SerializedLexicalNode
	}

	decorate() {
		return <Btn node_key={this.__key}></Btn>
	}
}

const Btn = $app.memo((props: { node_key: string }) => {
	const { node_key } = props
	const [editor] = useLexicalComposerContext()

	const onClick = useMemoizedFn(() => {
		editor.update(() => {
			const node = $getNodeByKey(node_key)

			const toggle_node = $findMatchingParent(node, $isToggleNode) as ToggleNode

			toggle_node.toggleOpen()
		})
	})

	return (
		<div className='w_100 h_100 flex justify_center align_center' onClick={onClick}>
			<CaretDown weight='fill' />
		</div>
	)
})
