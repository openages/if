import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { DB, LayoutModel, SettingModel, UserModel } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(public setting: SettingModel, public layout: LayoutModel, public user: UserModel, public db: DB) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
