import {
	$createParagraphNode,
	$getSelection,
	$insertNodes,
	$isRangeSelection,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DELETE_CHARACTER_COMMAND,
	INSERT_PARAGRAPH_COMMAND,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_LEFT_COMMAND,
	KEY_ARROW_RIGHT_COMMAND,
	KEY_ARROW_UP_COMMAND,
	KEY_ENTER_COMMAND
} from 'lexical'
import { injectable } from 'tsyringe'

import { INSERT_TOGGLE_COMMAND, SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { removeAndCheck } from '@/Editor/utils'
import Utils from '@/models/utils'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'

import ToggleBodyNode from './ToggleBodyNode'
import ToggleHeadNode from './ToggleHeadNode'
import ToggleNode from './ToggleNode'
import {
	$createToggleBodyNode,
	$createToggleBtnNode,
	$createToggleHeadNode,
	$createToggleNode,
	$isToggleBodyNode,
	$isToggleBtnNode,
	$isToggleHeadNode,
	$isToggleNode
} from './utils'

import type { LexicalEditor, LexicalNode } from 'lexical'

@injectable()
export default class Index {
	editor = null as LexicalEditor

	unregister = null as () => void

	constructor(public utils: Utils) {}

	init(editor: Index['editor']) {
		this.editor = editor

		this.on()
	}

	toggleNodeTranform(node: ToggleNode) {
		const children = node.getChildren()

		if (
			children.length === 3 &&
			$isToggleBtnNode(children[0]) &&
			$isToggleHeadNode(children[1]) &&
			$isToggleBodyNode(children[2])
		) {
			return true
		}

		for (const child of children) {
			node.insertBefore(child)
		}

		node.remove()
	}

	toggleHeadNodeTransform(node: ToggleHeadNode) {
		const toggle_node = node.getParent() as ToggleNode

		if ($isToggleNode(toggle_node)) return

		const p = $createParagraphNode()
		const children = node.getChildren()

		node.replace(p.append(...children))
	}

	toggleBodyNodeTransform(node: ToggleBodyNode) {
		const toggle_node = node.getParent() as ToggleNode

		if ($isToggleNode(toggle_node)) return

		const children = node.getChildren()

		for (const child of children) {
			node.insertBefore(child)
		}

		node.remove()
	}

	insertParagraph() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection)) return

		const anchor_node = selection.anchor.getNode()
		const head_node = $findMatchingParent(anchor_node, $isToggleHeadNode) as ToggleHeadNode
		const body_node = $findMatchingParent(anchor_node, $isToggleBodyNode) as ToggleBodyNode

		if ($isToggleHeadNode(head_node)) {
			const toggle_node = head_node.getParent() as ToggleNode

			if (!toggle_node) return
			if (!$isToggleNode(toggle_node)) return

			head_node.getNextSibling()?.selectEnd()

			return true
		}

		if ($isToggleBodyNode(body_node)) {
			const children = body_node.getChildren()

			if (!children.at(-1)?.getTextContentSize() && !children.at(-2)?.getTextContentSize()) {
				return true
			}
		}

		return false
	}

	onDelete() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection) || !selection.isCollapsed() || selection.anchor.offset !== 0) {
			return
		}

		const anchor = selection.anchor.getNode()
		const node = anchor.getParent()

		if ($isToggleHeadNode(node) && $isToggleNode(anchor.getTopLevelElement())) {
			removeAndCheck(anchor.getTopLevelElement())

			return true
		}

		if ($isToggleBodyNode(node) && !node.getTextContentSize()) {
			node.getPreviousSibling().selectEnd()

			return true
		}

		return false
	}

	onEnter() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection) || !selection.isCollapsed()) return

		const anchor = selection.anchor.getNode()
		const head_node = $findMatchingParent(anchor, $isToggleHeadNode) as ToggleHeadNode
		const body_node = $findMatchingParent(anchor, $isToggleBodyNode) as ToggleBodyNode

		if ($isToggleHeadNode(head_node)) {
			const toggle_node = $findMatchingParent(head_node, $isToggleNode) as ToggleNode

			if (!toggle_node.getLatest().__open) {
				toggle_node.toggleOpen(true)
			}
		}

		if ($isToggleBodyNode(body_node)) {
			const toggle_node = $findMatchingParent(body_node, $isToggleNode) as ToggleNode
			const children = body_node.getChildren()

			if (children.at(-1)?.getTextContentSize() === 0 && children.at(-2)?.getTextContentSize() === 0) {
				const next_node = toggle_node.getNextSibling()

				let p: LexicalNode

				if (next_node) {
					p = next_node
				} else {
					p = $createParagraphNode()

					toggle_node.insertAfter(p)
				}

				window.requestAnimationFrame(() =>
					this.editor.update(() => {
						children.at(-1).remove()
						children.at(-2).remove()

						p.selectEnd()
					})
				)

				return true
			}
		}

		return false
	}

	onEscapeDown() {
		const selection = $getSelection()

		if ($isRangeSelection(selection) && selection.isCollapsed()) {
			const toggle_node = $findMatchingParent(selection.anchor.getNode(), $isToggleNode) as ToggleNode

			if (!$isToggleNode(toggle_node)) return

			const parent = toggle_node.getParent()

			if (!parent) return
			if (parent.getLastChild() !== toggle_node) return

			const head_node = toggle_node.getFirstDescendant()
			const body_node = toggle_node.getLastDescendant()

			if (
				(head_node &&
					selection.anchor.key === head_node.getKey() &&
					selection.anchor.offset === head_node.getTextContentSize()) ||
				(body_node &&
					selection.anchor.key === body_node.getKey() &&
					selection.anchor.offset === body_node.getTextContentSize())
			) {
				toggle_node.insertAfter($createParagraphNode())
			}
		}

		return false
	}

	onEscapeUp() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection) || !selection.isCollapsed() || selection.anchor.offset !== 0) return

		const toggle_node = $findMatchingParent(selection.anchor.getNode(), $isToggleNode) as ToggleNode

		if (!$isToggleNode(toggle_node)) return

		const parent = toggle_node.getParent()

		if (!parent) return
		if (parent.getLastChild() !== toggle_node) return

		const head_node = toggle_node.getFirstDescendant()

		if (head_node && selection.anchor.key === head_node.getKey()) {
			toggle_node.insertBefore($createParagraphNode())
		}

		return false
	}

	insert() {
		this.editor.update(() => {
			const btn = $createToggleBtnNode()
			const head = $createToggleHeadNode()
			const body = $createToggleBodyNode()
			const p_title = $createParagraphNode()
			const p_body = $createParagraphNode()

			const node = $createToggleNode({ open: true }).append(btn, head.append(p_title), body.append(p_body))

			$insertNodes([node])

			p_title.select()
		})

		return true
	}

	checkSelection(path: Array<{ type: string; key: string }>) {
		if (path.find(item => item.type === 'toggle') !== undefined) {
			this.addListeners()
		} else {
			this.removeListeners()
		}

		return false
	}

	addListeners() {
		if (this.unregister) this.unregister()

		this.unregister = mergeRegister(
			this.editor.registerNodeTransform(ToggleNode, this.toggleNodeTranform),
			this.editor.registerNodeTransform(ToggleHeadNode, this.toggleHeadNodeTransform),
			this.editor.registerNodeTransform(ToggleBodyNode, this.toggleBodyNodeTransform),
			this.editor.registerCommand(
				INSERT_PARAGRAPH_COMMAND,
				this.insertParagraph.bind(this),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(DELETE_CHARACTER_COMMAND, this.onDelete.bind(this), COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_ENTER_COMMAND, this.onEnter.bind(this), COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(
				KEY_ARROW_DOWN_COMMAND,
				this.onEscapeDown.bind(this),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(
				KEY_ARROW_RIGHT_COMMAND,
				this.onEscapeDown.bind(this),
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(KEY_ARROW_UP_COMMAND, this.onEscapeUp.bind(this), COMMAND_PRIORITY_LOW),
			this.editor.registerCommand(KEY_ARROW_LEFT_COMMAND, this.onEscapeUp.bind(this), COMMAND_PRIORITY_LOW)
		)
	}

	removeListeners() {
		if (!this.unregister) return

		this.unregister()

		this.unregister = null
	}

	on() {
		this.utils.acts.push(
			this.editor.registerCommand(INSERT_TOGGLE_COMMAND, this.insert.bind(this), COMMAND_PRIORITY_EDITOR),
			this.editor.registerCommand(
				SELECTION_ELEMENTS_CHANGE,
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
