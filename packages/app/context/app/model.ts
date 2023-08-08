import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import { LocaleModel, SettingModel, LayoutModel, UserModel, DB } from '@/models'

@singleton()
export default class GlobalModel {
	constructor(
		public locale: LocaleModel,
		public setting: SettingModel,
		public layout: LayoutModel,
		public user: UserModel,
		public db: DB
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
