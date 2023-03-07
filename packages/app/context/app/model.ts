import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { SettingModel, UserModel } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(public setting: SettingModel, public user: UserModel) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
