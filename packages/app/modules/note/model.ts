import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { File } from '@/models'

@injectable()
export default class Index {
	id = ''

	constructor(public file: File) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)

		this.on()
	}

	on() {}

	off() {
		this.file.off()
	}
}
