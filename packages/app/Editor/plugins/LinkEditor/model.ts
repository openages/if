import {
	$getSelection,
	$isNodeSelection,
	$isRangeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW
} from 'lexical'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { $getMatchingParent } from '@/Editor/utils'
import Utils from '@/models/utils'
import { $isAutoLinkNode, $isLinkNode } from '@lexical/link'
import { mergeRegister } from '@lexical/utils'

import type { LexicalEditor, LexicalNode } from 'lexical'
import type { LinkNode } from '@lexical/link'
import type { FocusEvent } from 'react'

@injectable()
export default class Index {
	editor = null as LexicalEditor
	node = null as LinkNode
	dom = null as HTMLAnchorElement

	visible = false
	position = null as { x: number; y: number }
	link = ''

	unregister = null as () => void

	constructor(public utils: Utils) {
		makeAutoObservable(
			this,
			{ utils: false, editor: false, node: false, dom: false, unregister: false },
			{ autoBind: true }
		)
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.on()
	}

	reset() {
		this.node = null
		this.dom = null

		this.visible = false
		this.position = null
		this.link = ''

		return false
	}

	onChange(e: FocusEvent<HTMLInputElement>) {
		e.preventDefault()

		if (!this.node) return

		this.editor.update(() => {
			const target = this.node.getWritable()

			if (e.target.value === target.__url) return

			target.__url = e.target.value
		})
	}

	getLinkNode() {
		const selection = $getSelection()

		let node: LexicalNode

		if ($isRangeSelection(selection)) node = selection.anchor.getNode()
		if ($isNodeSelection(selection)) node = selection.getNodes()[0]

		const target = ($getMatchingParent(node, $isLinkNode) ||
			$getMatchingParent(node, $isAutoLinkNode)) as LinkNode

		if (target) {
			this.node = target
			this.link = target.getURL()
			this.dom = this.editor.getElementByKey(target.__key) as HTMLAnchorElement

			return target
		} else {
			this.reset()

			return null
		}
	}

	updatePosition() {
		if (!this.node || !this.visible) return

		const rect = this.editor.getElementByKey(this.node.getKey()).getBoundingClientRect()

		this.position = { x: rect.x, y: rect.y + rect.height }
	}

	check(e?: MouseEvent) {
		const node = this.getLinkNode()

		if (!node) return false

		if (e && (!this.editor.isEditable() || e.metaKey || e.ctrlKey)) {
			window.open(this.node.getURL(), '_blank')
		} else {
			this.visible = true

			this.updatePosition()
		}

		return true
	}

	checkSelection(path: Array<{ type: string; key: string }>) {
		const tables = path.filter(item => item.type === 'link' || item.type === 'autolink')

		if (tables.length) {
			this.removeListners()
			this.addListners()
		} else {
			this.reset()
			this.removeListners()
		}

		return false
	}

	addListners() {
		this.removeListners()

		this.unregister = mergeRegister(
			this.editor.registerCommand(CLICK_COMMAND, this.check, COMMAND_PRIORITY_LOW)
		)
	}

	removeListners() {
		if (this.unregister) this.unregister()

		this.unregister = null
	}

	on() {
		this.utils.acts.push(
			this.editor.registerCommand(SELECTION_ELEMENTS_CHANGE, this.checkSelection, COMMAND_PRIORITY_HIGH)
		)
	}

	off() {
		this.utils.off()

		this.removeListners()
	}
}
