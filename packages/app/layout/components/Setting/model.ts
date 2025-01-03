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

	goLogin() {
		this.active = 'account'
		this.global.setting.visible = true
	}

	goBilling() {
		this.active = 'billing'
		this.global.setting.visible = true
	}

	on() {
		window.$app.Event.on('global.setting.goLogin', this.goLogin)
		window.$app.Event.on('global.setting.goBilling', this.goBilling)
	}

	off() {
		window.$app.Event.off('global.setting.goLogin', this.goLogin)
		window.$app.Event.off('global.setting.goBilling', this.goBilling)
	}
}
