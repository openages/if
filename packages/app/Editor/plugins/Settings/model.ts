import { $getRoot } from 'lexical'
import { injectable } from 'tsyringe'

import { serif, small_text } from '@/Editor/theme/init.css'
import { NoteSettings } from '@/models'

import type { LexicalEditor } from 'lexical'

@injectable()
export default class Index {
	container = null as HTMLElement
	editor = null as LexicalEditor

	constructor(public settings: NoteSettings) {}

	init(id: string, editor: Index['editor']) {
		this.container = document.getElementById(id)
		this.editor = editor
	}

	getContainer() {
		return this.editor.getEditorState().read(() => {
			const root = $getRoot()

			return this.editor.getElementByKey(root.getKey()).parentElement
		})
	}

	setSerif(v: boolean) {
		const container = this.getContainer()
		const title_el = this.container.querySelector('.article_title') as HTMLElement

		if (v) {
			container.classList.add(serif)
			title_el.classList.add('serif')
		} else {
			container.classList.remove(serif)
			title_el.classList.remove('serif')
		}
	}

	setSmallText(v: boolean) {
		const container = this.getContainer()

		if (v) {
			container.classList.add(small_text)
		} else {
			container.classList.remove(small_text)
		}
	}
}
