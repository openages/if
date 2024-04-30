import { $insertNodes, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { makeAutoObservable } from 'mobx'

import { INSERT_KATEX_COMMAND } from '@/Editor/commands'
import { insertAfter } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import { $createKatexNode } from './utils'

import type { LexicalEditor } from 'lexical'
import type { IPropsKatex } from './types'

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
			this.editor.registerCommand<IPropsKatex>(
				INSERT_KATEX_COMMAND,
				payload => {
					const node = $createKatexNode(payload)

					$insertNodes([node])
					insertAfter(node)

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
