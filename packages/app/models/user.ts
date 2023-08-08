import { makeAutoObservable } from 'mobx'
import { genConfig } from 'react-nice-avatar'
import { injectable } from 'tsyringe'

import { setStorageWhenChange } from '@/utils'
import { local } from '@openages/craftkit'

import type { AvatarFullConfig } from 'react-nice-avatar'

@injectable()
export default class Index {
	avatar = {} as AvatarFullConfig

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		setStorageWhenChange(['avatar'], this)

		const avatar = (local.avatar || genConfig()) as AvatarFullConfig

		this.setAvatar(avatar)
	}

	setAvatar(avatar: AvatarFullConfig) {
		this.avatar = avatar
	}
}
