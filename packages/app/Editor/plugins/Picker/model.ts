import { makeAutoObservable } from 'mobx'

import type { LexicalEditor } from 'lexical'
import type { TypeaheadMenuPluginProps } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type Option from './option'

export default class Index {
	editor = null as LexicalEditor
	modal = '' as 'Image' | 'Emoji'
	query = ''
	index = null as number

	constructor() {
		makeAutoObservable(this, { editor: false }, { autoBind: true })
	}

	init(editor: Index['editor']) {
		this.editor = editor
	}

	onSelectOption(...args: Parameters<TypeaheadMenuPluginProps<Option>['onSelectOption']>) {
		const [selectedOption, node, close, query_string] = args

		this.editor.update(() => {
			node?.remove()
			selectedOption.onSelect(query_string)

			close()
		})
	}
}
