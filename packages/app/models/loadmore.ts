import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

@injectable()
export default class Index {
	page = 0
	end = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	loadMore() {
		if (this.end) return

		this.page = this.page + 1
	}
}
