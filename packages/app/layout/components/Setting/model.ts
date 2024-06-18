import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

@injectable()
export default class Index {
	ref = null as HTMLElement

	active = 'global'
	mini = false
	visible_menu = false

	constructor() {
		makeAutoObservable(this, { ref: false }, { autoBind: true })
	}
}
