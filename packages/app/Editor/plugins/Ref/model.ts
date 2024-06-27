import { COMMAND_PRIORITY_EDITOR } from 'lexical'
import { makeObservable } from 'mobx'

import { INSERT_REF_COMMAND } from '@/Editor/commands'
import { insertBlock } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import { $createRefNode } from './utils'

import type { LexicalEditor } from 'lexical'
import type { IPropsRef } from './types'

export default class Index {
	editor = null as LexicalEditor

	unregister = null as () => void

	constructor() {
		makeObservable(this, {}, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.register()
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand<IPropsRef>(
				INSERT_REF_COMMAND,
				payload => {
					const node = $createRefNode(payload)

					insertBlock(node)

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
