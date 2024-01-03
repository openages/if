import { makeAutoObservable } from 'mobx'

import type { Auth } from '@/types'

export default class Index {
	user_type = 'infinity' as Auth.UserType

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {}
}
