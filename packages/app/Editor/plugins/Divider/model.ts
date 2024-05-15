import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { makeAutoObservable } from 'mobx'

import { INSERT_DIVIDER_COMMAND } from '@/Editor/commands'
import { insertBlock } from '@/Editor/utils'
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
					return insertBlock($createDividerNode())
				},
				COMMAND_PRIORITY_EDITOR
			)
		)
	}

	off() {
		this.unregister()
	}
}
