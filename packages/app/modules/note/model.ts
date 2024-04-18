import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { update } from '@/components/DirTree/services'
import { File } from '@/models'

import type { FocusEvent } from 'react'
import type { App } from '@/types'

@injectable()
export default class Index {
	id = ''
	module = '' as App.ModuleType

	constructor(public file: File) {
		makeAutoObservable(this, { id: false, module: false }, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id

		this.file.init(id)

		this.on()
	}

	onChangeFileName(e: FocusEvent<HTMLInputElement>) {
		const name = e.target.value

		if (!name) return

		const item = { id: this.id, name }

		if (this.module === 'note') {
			$app.Event.emit('note/dirtree/update', item)
		} else {
			update({ item })
		}
	}

	on() {}

	off() {
		this.file.off()
	}
}
