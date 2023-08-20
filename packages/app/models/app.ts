import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import type { App } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'
import type { DocSetting } from '@/schemas'

@injectable()
export default class Index {
	apps_query = {} as RxQuery<DocSetting>
	app_modules = [] as App.Modules
	actives = [] as Array<{ app: App.ModuleType; pathname: string; key: string }>
	visible_app_menu = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	get apps() {
		return toJS(this.app_modules).filter((item) => {
			if (item.is_fixed) return true
			if (this.actives.find((i) => i.app === item.title)) return true

			return false
		})
	}

	init() {
		this.query()
	}

	async query() {
		this.apps_query = $db.setting.findOne({ selector: { key: 'apps' } })! as RxQuery<DocSetting>

		const target = (await this.apps_query.exec()) as RxDocument<DocSetting>

		this.app_modules = JSON.parse(target.data)

		target.$.subscribe(({ data }) => {
			this.app_modules = JSON.parse(data)
		})
	}

	setActives(v: Index['actives']) {
		this.actives = v
	}

	toggleAppMenu() {
		this.visible_app_menu = !this.visible_app_menu
	}

	on() {
		$app.Event.on('db/ready', this.init)
		$app.Event.on('global.app.toggleAppMenu', this.toggleAppMenu)
	}

	off() {
		$app.Event.off('db/ready', this.init)
		$app.Event.off('global.app.toggleAppMenu', this.toggleAppMenu)

		this.apps_query?.$?.unsubscribe?.()
	}
}
