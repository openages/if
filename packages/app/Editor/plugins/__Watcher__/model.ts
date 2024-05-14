import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical'

import { SELECTION_ELEMENTS_CHANGE } from '@/Editor/commands'
import { mergeRegister } from '@lexical/utils'
import { deepEqual } from '@openages/stk/react'

import type { LexicalEditor } from 'lexical'

export default class Index {
	editor = null as LexicalEditor
	path = []

	init(editor: Index['editor']) {
		this.editor = editor
	}

	watcher() {
		const selection = $getSelection()

		if (!$isRangeSelection(selection)) return

		const anchor = selection.anchor
		const focus = selection.focus

		if (anchor.offset !== focus.offset) return

		const parents = anchor.getNode().getParents()
		const path = parents.map(item => ({ type: item.getType(), key: item.getKey() }))

		if (deepEqual(path, this.path)) return

		this.editor.dispatchCommand(SELECTION_ELEMENTS_CHANGE, path)

		this.path = path

		return false
	}

	register() {
		return mergeRegister(
			this.editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				this.watcher.bind(this),
				COMMAND_PRIORITY_CRITICAL
			)
		)
	}
}
