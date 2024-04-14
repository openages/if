import {
	$createParagraphNode,
	$insertNodes,
	$isRootOrShadowRoot,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_LOW
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { INSERT_IMAGE_COMMAND } from '@/Editor/commands'
import { DRAG_DROP_PASTE } from '@lexical/rich-text'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'

import { $createImageNode, dragInsert } from './utils'

import type { LexicalEditor } from 'lexical'
import type { IPropsImage } from './types'

export default class Index {
	editor = null as LexicalEditor

	unregister = null as () => void

	constructor() {
		makeAutoObservable(
			this,
			{ editor: false, unregister: false, init: false, register: false },
			{ autoBind: true }
		)
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

					$insertNodes([node])

					if ($isRootOrShadowRoot(node.getParentOrThrow())) {
						$wrapNodeInElement(node, $createParagraphNode).selectEnd()
					}

					return true
				},
				COMMAND_PRIORITY_EDITOR
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
