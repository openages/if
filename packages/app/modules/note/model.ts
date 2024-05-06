import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { update } from '@/components/DirTree/services'
import { File } from '@/models'

import type { FocusEvent, ChangeEvent, KeyboardEvent } from 'react'
import type { App } from '@/types'

@injectable()
export default class Index {
	id = ''
	module = '' as App.ModuleType

	constructor(public file: File) {
		makeAutoObservable(this, { file: false, id: false, module: false }, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id

		this.file.init(id)

		this.on()
	}

	onChangeFileName(e: ChangeEvent<HTMLTextAreaElement>) {
		const name = e.target.value

		if (!name) return

		this.file.data = { ...this.file.data, name }
	}

	onBlurFileName(e: FocusEvent<HTMLTextAreaElement>) {
		const name = e.target.value

		if (!name) return

		const item = { id: this.id, name }

		if (this.module === 'note') {
			$app.Event.emit('note/dirtree/update', item)
		} else {
			update({ item })
		}
	}

	onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter') {
			e.preventDefault()
		}
	}

	on() {}

	off() {
		this.file.off()
	}
}
