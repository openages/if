import { makeAutoObservable } from 'mobx'

import { SHOW_MODAL_COMMAND } from '@/Editor/commands'

import { IPropsComponent } from '../types'

import type { LexicalEditor } from 'lexical'

export default class Index {
	key = ''
	editor = null as LexicalEditor
	node = null as IPropsComponent['node']

	constructor() {
		makeAutoObservable(
			this,
			{
				key: false,
				editor: false,
				node: false
			},
			{ autoBind: true }
		)
	}

	init(editor: Index['editor'], node: IPropsComponent['node'], key: Index['key']) {
		this.editor = editor
		this.node = node
		this.key = key
	}

	onClick() {
		this.editor.dispatchCommand(SHOW_MODAL_COMMAND, { type: 'Katex', node_key: this.key })
	}
}
