import { COMMAND_PRIORITY_LOW } from 'lexical'
import { makeObservable } from 'mobx'

import { INSERT_NAVIGATION_COMMAND } from '@/Editor/commands'
import { insertBlock } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import { $createNavigationNode } from './utils'

import type { LexicalEditor } from 'lexical'
import type NavigationNode from './Node'

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
			this.editor.registerCommand(
				INSERT_NAVIGATION_COMMAND,
				() => {
					const node = $createNavigationNode() as NavigationNode

					insertBlock(node)

					return true
				},
				COMMAND_PRIORITY_LOW
			)
		)
	}

	off() {
		this.unregister()
	}
}
