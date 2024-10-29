import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DELETE_CHARACTER_COMMAND
} from 'lexical'
import { injectable } from 'tsyringe'

import { CHANGE_SELECTION_ELEMENTS } from '@/Editor/commands'
import { $getMatchingParent } from '@/Editor/utils'
import Utils from '@/models/utils'
import { mergeRegister } from '@lexical/utils'

import QuoteNode from './QuoteNode'
import { $isQuoteNode } from './utils'

import type { LexicalEditor } from 'lexical'

@injectable()
export default class Index {
	editor = null as unknown as LexicalEditor

	unregister = null as unknown as () => void

	constructor(public utils: Utils) {}

	init(editor: Index['editor']) {
		this.editor = editor

		this.on()
	}

	quoteNodeTranform(node: QuoteNode) {
		const children = node.getChildren()
		const children_length = children.length
		const p = $createParagraphNode()

		if (!children_length) {
			node.append(p)

			return true
		}

		if (
			children_length >= 3 &&
			children[children_length - 1].getTextContent() === '' &&
			children[children_length - 2].getTextContent() === '' &&
			children[children_length - 3].getTextContent() === ''
		) {
			children[children_length - 1].remove()
			children[children_length - 2].remove()
			children[children_length - 3].remove()

			node.insertAfter(p)
			node.selectNext()

			return true
		}

		return false
	}

	onDelete() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection) || !selection.isCollapsed() || selection.anchor.offset !== 0) {
			return
		}

		const anchor = selection.anchor.getNode()
		const quote_node = $getMatchingParent(anchor, $isQuoteNode) as QuoteNode

		if (!quote_node) return false

		const children = quote_node.getChildren()

		if (children.length === 1 && children[0].getTextContent() === '') {
			if (!quote_node.getPreviousSibling() && !quote_node.getNextSibling()) {
				quote_node.insertAfter($createParagraphNode())
			}

			quote_node.remove()

			return true
		}

		return false
	}

	checkSelection(path: Array<{ type: string; key: string }>) {
		if (path.find(item => item.type === 'quote') !== undefined) {
			this.addListeners()
		} else {
			this.removeListeners()
		}

		return false
	}

	addListeners() {
		if (this.unregister) this.unregister()

		this.unregister = mergeRegister(
			this.editor.registerCommand(DELETE_CHARACTER_COMMAND, this.onDelete.bind(this), COMMAND_PRIORITY_LOW)
		)
	}

	removeListeners() {
		if (!this.unregister) return

		this.unregister()

		this.unregister = null as unknown as () => void
	}

	on() {
		this.utils.acts.push(
			this.editor.registerNodeTransform(QuoteNode, this.quoteNodeTranform),
			this.editor.registerCommand(
				CHANGE_SELECTION_ELEMENTS,
				this.checkSelection.bind(this),
				COMMAND_PRIORITY_HIGH
			)
		)
	}

	off() {
		this.utils.off()

		this.removeListeners()
	}
}
