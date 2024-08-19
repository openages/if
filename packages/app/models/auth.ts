import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { Auth } from '@/types'
import { setStorageWhenChange } from '@openages/stk/mobx'

@injectable()
export default class Index {
	sign_type = 'signup' as 'signin' | 'signup'
	user_type = Auth.UserTypes.gold_sponsor as Auth.UserType
	infinity = false

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false }, { autoBind: true })
	}

	init() {
		this.utils.acts = [setStorageWhenChange(['user_type', 'infinity'], this)]
	}

	off() {
		this.utils.off()
	}
}
