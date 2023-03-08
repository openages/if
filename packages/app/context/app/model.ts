import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { LayoutModel, SettingModel, UserModel } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(public setting: SettingModel, public layout: LayoutModel, public user: UserModel) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
