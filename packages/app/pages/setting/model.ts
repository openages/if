import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

@injectable()
export default class Index {
	active_index = 0

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
