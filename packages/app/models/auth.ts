import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { Auth } from '@/types'
import { trpc } from '@/utils'
import { loading } from '@/utils/decorators'
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
		// this.utils.acts = [setStorageWhenChange(['user_type', 'infinity'], this)]
	}

	@loading
	async signin() {}

	@loading
	async signup() {}

	@loading
	async sendVerifyCode() {
		const [err, res] = await to(trpc.auth.sendVerifyCode.mutate({ email: 'xiewendaogmail.com' }))

		// console.log(err, res)
	}

	off() {
		this.utils.off()
	}
}
