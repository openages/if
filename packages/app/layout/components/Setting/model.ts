import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'

@injectable()
export default class Index {
	ref = null as unknown as HTMLElement

	active = 'global'
	mini = false
	visible_menu = false

	constructor(public global: GlobalModel) {
		makeAutoObservable(this, { ref: false }, { autoBind: true })
	}

	goPaid() {
		this.active = 'paid'
		this.global.setting.visible = true
	}

	on() {
		window.$app.Event.on('global.setting.goPaid', this.goPaid)
	}

	off() {
		window.$app.Event.off('global.setting.goPaid', this.goPaid)
	}
}
