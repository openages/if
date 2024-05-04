import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { makeAutoObservable } from 'mobx'

import { INSERT_DIVIDER_COMMAND } from '@/Editor/commands'
import { getSelectedNode } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import { $createDividerNode } from './utils'

import type { LexicalEditor } from 'lexical'

export default class Index {
	editor = null as LexicalEditor

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { editor: false, unregister: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.register()
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand(
				INSERT_DIVIDER_COMMAND,
				_ => {
					const selection = $getSelection()

					if (!$isRangeSelection(selection)) return

					const selected_node = getSelectedNode(selection)
					const node = $createDividerNode()

					if (selected_node.getTextContentSize()) {
						selected_node.getTopLevelElement().insertAfter(node)
					} else {
						selected_node.replace(node)

						const next = selected_node.getNextSibling()

						if (next) next.selectStart()
					}

					return true
				},
				COMMAND_PRIORITY_EDITOR
			)
		)
	}

	off() {
		this.unregister()
	}
}
