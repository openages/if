import { $getRoot, COMMAND_PRIORITY_LOW, KEY_DOWN_COMMAND, UNDO_COMMAND } from 'lexical'
import { debounce } from 'lodash-es'

import { mergeRegister } from '@lexical/utils'

import type { IPropsUpdater } from './types'

import type { Lexical } from '@/types'
import type { LexicalEditor } from 'lexical'

export default class Index {
	editor = null as LexicalEditor
	max_length = 0
	linebreak = false

	onChange: IPropsUpdater['onChange']
	onKeyDown: IPropsUpdater['onKeyDown']
	unregister = null as () => void

	lisnter = null as () => void

	init(
		editor: Index['editor'],
		max_length: Index['max_length'],
		linebreak: Index['linebreak'],
		onChange: Index['onChange'],
		onKeyDown: Index['onKeyDown']
	) {
		this.editor = editor
		this.max_length = max_length
		this.linebreak = linebreak

		this.onChange = onChange

		if (onKeyDown) {
			this.onKeyDown = onKeyDown
		}

		this.on()

		if (!this.linebreak) {
			this.addKeyDownLisnter()
		}
	}

	onUpdate(args: Lexical.ArgsUpdateListener) {
		if (this.editor.isComposing()) return

		const { editorState } = args

		if (this.max_length) {
			const text = editorState.read(() => $getRoot().getTextContent())

			if (text.length > this.max_length) {
				this.editor.dispatchCommand(UNDO_COMMAND, null)
			}
		}

		this.onChange(JSON.stringify(editorState.toJSON()))
	}

	addKeyDownLisnter() {
		this.lisnter = this.editor.registerCommand(
			KEY_DOWN_COMMAND,
			e => {
				this.onKeyDown?.(e)

				if (e.key === 'Enter') {
					e.preventDefault()

					return true
				}

				return false
			},
			COMMAND_PRIORITY_LOW
		)
	}

	removeKeyDownLisnter() {
		this.lisnter?.()
	}

	on() {
		const onUpdate = debounce(this.onUpdate.bind(this), 450)

		this.unregister = mergeRegister(this.editor.registerUpdateListener(onUpdate))
	}

	off() {
		this.unregister?.()

		this.removeKeyDownLisnter()
	}
}
