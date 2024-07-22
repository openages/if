import { $getRoot, BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND, KEY_DOWN_COMMAND, UNDO_COMMAND } from 'lexical'
import { debounce } from 'lodash-es'

import { mergeRegister } from '@lexical/utils'

import type { IPropsTextLoader } from './types'

import type { Lexical } from '@/types'
import type { LexicalEditor } from 'lexical'

export default class Index {
	editor = null as LexicalEditor
	max_length = 0
	linebreak = false

	onChange: IPropsTextLoader['onChange']
	onKeyDown: IPropsTextLoader['onKeyDown']
	onFocus: IPropsTextLoader['onFocus']
	unregister = null as () => void

	lisnter_keydown = null as () => void
	lisnter_focus = null as () => void

	init(
		editor: Index['editor'],
		max_length: Index['max_length'],
		linebreak: Index['linebreak'],
		onChange: Index['onChange'],
		onKeyDown: Index['onKeyDown'],
		onFocus: Index['onFocus']
	) {
		this.editor = editor
		this.max_length = max_length
		this.linebreak = linebreak

		this.onChange = onChange

		if (onKeyDown) this.onKeyDown = onKeyDown

		if (onFocus) {
			this.onFocus = onFocus

			this.addFocusLisnter()
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
		this.lisnter_keydown = this.editor.registerCommand(
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
		this.lisnter_keydown?.()
	}

	addFocusLisnter() {
		this.lisnter_focus = mergeRegister(
			this.editor.registerCommand(
				FOCUS_COMMAND,
				() => {
					this.onFocus(true)

					return false
				},
				COMMAND_PRIORITY_LOW
			),
			this.editor.registerCommand(
				BLUR_COMMAND,
				() => {
					this.onFocus(false)

					return false
				},
				COMMAND_PRIORITY_LOW
			)
		)
	}

	removeFocusLisnter() {
		this.lisnter_focus?.()
	}

	on() {
		const onUpdate = debounce(this.onUpdate.bind(this), 450)

		this.unregister = mergeRegister(this.editor.registerUpdateListener(onUpdate))
	}

	off() {
		this.unregister?.()

		this.removeKeyDownLisnter()
		this.removeFocusLisnter()
	}
}
