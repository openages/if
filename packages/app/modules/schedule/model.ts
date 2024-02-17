import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { File } from '@/models'

import type { View } from './types/model'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as View

	constructor(public file: File) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)
	}

	on() {}

	off() {}
}
