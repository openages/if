import { makeAutoObservable } from 'mobx'

import type { Auth } from '@/types'

export default class Index {
	user_type = 'golden_sponsor' as Auth.UserType

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {}
}
