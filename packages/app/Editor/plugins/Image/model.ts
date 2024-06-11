import { $getSelection, COMMAND_PRIORITY_LOW } from 'lexical'
import { makeObservable } from 'mobx'

import { INSERT_IMAGE_COMMAND } from '@/Editor/commands'
import { insertBlock } from '@/Editor/utils'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { mergeRegister } from '@lexical/utils'

import { $createImageNode, dragInsert } from './utils'

import type { LexicalEditor } from 'lexical'
import type { IPropsImage } from './types'

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
			this.editor.registerCommand<IPropsImage>(
				INSERT_IMAGE_COMMAND,
				payload => {
					const node = $createImageNode(payload)

					insertBlock(node)

					return true
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(
				DRAG_DROP_PASTE,
				files => {
					dragInsert(this.editor, files)

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
