import {
	$createParagraphNode,
	$insertNodes,
	$isRootOrShadowRoot,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DRAGOVER_COMMAND,
	DRAGSTART_COMMAND,
	DROP_COMMAND
} from 'lexical'
import { makeAutoObservable } from 'mobx'

import { INSERT_IMAGE_COMMAND } from '@/Editor/commands'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'

import { $createImageNode, onDragOver, onDragStart, onDrop } from './utils'

import type { LexicalEditor } from 'lexical'
import type { IPropsImage } from './types'

export default class Index {
	editor = null as LexicalEditor

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { editor: false, unregister: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand<IPropsImage>(
				INSERT_IMAGE_COMMAND,
				payload => {
					const imageNode = $createImageNode(payload)

					$insertNodes([imageNode])

					if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
						$wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
					}

					return true
				},
				COMMAND_PRIORITY_EDITOR
			),
			this.editor.registerCommand<DragEvent>(
				DRAGSTART_COMMAND,
				event => {
					return onDragStart(event)
				},
				COMMAND_PRIORITY_HIGH
			),
			this.editor.registerCommand<DragEvent>(
				DRAGOVER_COMMAND,
				event => {
					return onDragOver(event)
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand<DragEvent>(
				DROP_COMMAND,
				event => {
					return onDrop(event, this.editor)
				},
				COMMAND_PRIORITY_HIGH
			)
		)
	}

	off() {
		this.unregister()
	}
}
