import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { Auth } from '@/types'
import { setStorageWhenChange } from '@openages/stk/mobx'

@injectable()
export default class Index {
	user_type = Auth.UserTypes.gold_sponsor as Auth.UserType
	visible_pay_modal = false

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		this.utils.acts = [setStorageWhenChange(['user_type'], this)]

		this.on()
	}

	showVisiblePayModal() {
		this.visible_pay_modal = true
	}

	on() {
		$app.Event.on('global.auth.showVisiblePayModal', this.showVisiblePayModal)
	}

	off() {
		this.utils.off()

		$app.Event.off('global.auth.showVisiblePayModal', this.showVisiblePayModal)
	}
}
