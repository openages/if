import { throttle } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import transformers from '@/Editor/transformers'
import { File } from '@/models'
import { downloadFile } from '@/utils'
import { $convertToMarkdownString } from '@lexical/markdown'

import type { LexicalEditor } from 'lexical'
import type { CSSProperties } from 'react'

@injectable()
export default class Index {
	id = ''
	editor = null as LexicalEditor
	container = null as HTMLElement
	observer = null as ResizeObserver

	style = {} as CSSProperties
	visible_options = false

	unregister = null as () => void

	constructor(public file: File) {
		makeAutoObservable(
			this,
			{
				file: false,
				id: false,
				editor: false,
				container: false,
				observer: false,
				unregister: false
			},
			{ autoBind: true }
		)
	}

	init(id: Index['id'], editor: Index['editor']) {
		this.id = id
		this.editor = editor
		this.container = document.getElementById(this.id)

		this.file.init(id)

		this.getPosition()
		this.on()
	}

	getPosition() {
		const { right, top } = this.container.getBoundingClientRect()

		this.style = { left: right - 30, top: top + 6 }
	}

	exportMd() {
		const res = $convertToMarkdownString(transformers, null, false)

		downloadFile(this.file.data.name, res, 'md')
	}

	importMd() {}

	on() {
		this.observer = new ResizeObserver(throttle(this.getPosition, 60))

		this.observer.observe(this.container)
	}

	off() {
		this.file.off()

		if (this.observer) {
			this.observer.unobserve(this.container)
			this.observer.disconnect()
		}
	}
}
