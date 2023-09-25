import { makeAutoObservable, reaction, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'

import type { App } from '@/types'
import type { RxDocument, RxQuery } from 'rxdb'
import type { DocSetting } from '@/schemas'

@injectable()
export default class Index {
	apps_query = {} as RxQuery<DocSetting>
	apps_doc = {} as RxDocument<DocSetting>
	app_modules = [] as App.Modules
	actives = [] as Array<{ app: App.ModuleType; pathname: string; key: string }>
	visible_app_menu = false
	visible_app_switch = false
	switch_index = 0

	constructor(public utils: Utils) {
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
		this.reactions()
		this.query()

		this.on()
	}

	reactions() {
		this.utils.acts = [
			reaction(
				() => [this.visible_app_menu, this.visible_app_switch],
				([visible_app_menu, visible_app_switch]) => {
					if (visible_app_menu) this.visible_app_switch = false
					if (visible_app_switch) this.visible_app_menu = false
				}
			)
		]
	}

	async query() {
		this.apps_query = $db.setting.findOne({ selector: { key: 'apps' } })! as RxQuery<DocSetting>

		this.apps_doc = (await this.apps_query.exec()) as RxDocument<DocSetting>

		this.app_modules = JSON.parse(this.apps_doc.data)

		this.apps_doc.$.subscribe(({ data }) => {
			this.app_modules = JSON.parse(data)
		})
	}

	async update(v: App.Modules) {
		this.app_modules = v

		this.apps_doc.incrementalPatch({ data: JSON.stringify(v) })
	}

	setActives(v: Index['actives']) {
		this.actives = v
	}

	toggleAppMenu() {
		this.visible_app_menu = !this.visible_app_menu
	}

	appSwitch() {
		if (!this.actives.length) return

		if (!this.visible_app_switch) {
			this.visible_app_switch = true
		} else {
			this.changeSwitchIndex()
		}
	}

	handleAppSwitch() {
		if (!this.visible_app_switch) return

		this.visible_app_switch = false

		$navigate(this.actives[this.switch_index].pathname)
	}

	changeSwitchIndex(index?: number) {
		if (index !== undefined) return (this.switch_index = index)

		const next_value = this.switch_index + 1

		if (next_value > this.actives.length - 1) {
			this.switch_index = 0
		} else {
			this.switch_index = next_value
		}
	}

	on() {
		$app.Event.on('global.app.toggleAppMenu', this.toggleAppMenu)
		$app.Event.on('global.app.appSwitch', this.appSwitch)
		$app.Event.on('global.app.handleAppSwitch', this.handleAppSwitch)

		window.addEventListener('blur', this.handleAppSwitch)
	}

      off() {
            this.utils.off()
            
		$app.Event.off('global.app.toggleAppMenu', this.toggleAppMenu)
		$app.Event.off('global.app.appSwitch', this.appSwitch)
		$app.Event.off('global.app.handleAppSwitch', this.handleAppSwitch)

		this.apps_query?.$?.unsubscribe?.()

		window.removeEventListener('blur', this.handleAppSwitch)
	}
}
