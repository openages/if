import { COMMAND_PRIORITY_EDITOR } from 'lexical'
import { makeAutoObservable } from 'mobx'

import { SHOW_MODAL_COMMAND } from '@/Editor/commands'
import { $focus } from '@/Editor/utils'
import { mergeRegister } from '@lexical/utils'

import type { LexicalEditor } from 'lexical'
import type { TypeaheadMenuPluginProps } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type Option from './option'

export default class Index {
	editor = null as LexicalEditor
	modal = '' as 'Image' | 'Emoji' | 'Katex' | 'Mermaid'
	node_key = ''
	query = ''
	index = null as number

	unregister = null as () => void

	constructor() {
		makeAutoObservable(this, { editor: false, unregister: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor

		this.register()
	}

	show(v: Index['modal']) {
		this.modal = v
		this.node_key = ''
	}

	close() {
		const node_key = this.node_key

		this.modal = '' as Index['modal']
		this.node_key = ''

		if (!node_key) return

		$focus(this.editor)
	}

	onSelectOption(...args: Parameters<TypeaheadMenuPluginProps<Option>['onSelectOption']>) {
		const [selectedOption, node, close, query_string] = args

		this.editor.update(() => {
			node?.remove()
			selectedOption.onSelect(query_string)

			close()
		})
	}

	register() {
		this.unregister = mergeRegister(
			this.editor.registerCommand<{ type: Index['modal']; node_key?: Index['node_key'] }>(
				SHOW_MODAL_COMMAND,
				payload => {
					const { type, node_key } = payload

					this.modal = type

					if (node_key) this.node_key = node_key

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
