import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'
import Utils from '@/models/utils'
import { ipc, is_electron_shell, is_mas_id } from '@/utils'
import { setStorageWhenChange, useInstanceWatch } from '@openages/stk/mobx'

import type { App } from '@/types'
import type { Watch } from '@openages/stk/mobx'

export interface HasUpdate {
	type: 'has_update'
	version: string
}

export interface Downloading {
	type: 'downloading'
	percent: number
}

type UpdateState = null | HasUpdate | Downloading | { type: 'downloaded' }

@injectable()
export default class Index {
	app_modules = modules as App.Modules
	actives = [] as Array<{ app: App.ModuleType; pathname: string; key: string }>
	visible_app_menu = false
	visible_app_switch = false
	switch_index = 0
	update_silence = true
	update_status = null as UpdateState

	get visibles() {
		return [this.visible_app_menu, this.visible_app_switch]
	}

	watch = {
		'visible_app_menu|visible_app_switch': () => {
			if (this.visible_app_menu) this.visible_app_switch = false
			if (this.visible_app_switch) this.visible_app_menu = false
		}
	} as Watch<Index & { 'visible_app_menu|visible_app_switch': any }>

	constructor(public utils: Utils) {
		makeAutoObservable(this, { utils: false, watch: false }, { autoBind: true })
	}

	get apps() {
		return $copy(this.app_modules).filter(item => {
			if (item.plan) return false
			if (item.fixed) return true
			if (this.actives.find(i => i.app === item.title)) return true

			return false
		})
	}

	init() {
		this.utils.acts = [
			// setStorageWhenChange(['app_modules'], this),
			...useInstanceWatch(this)
		]

		this.on()

		if (!is_mas_id && is_electron_shell) {
			this.onAppUpdate()
			this.checkUpdate(true)
		}
	}

	update(v: App.Modules) {
		this.app_modules = v
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

	onAppUpdate() {
		ipc.app.update.subscribe(undefined, {
			onData: args => {
				switch (args.type) {
					case 'can_update':
						this.update_status = { type: 'has_update', version: args.value }
						break
					case 'cant_update':
						if (!this.update_silence) $message.info($t('setting.Update.no_update'))

						break
					case 'progress':
						this.update_status = { type: 'downloading', percent: args.value }

						break
					case 'downloaded':
						this.update_status = { type: 'downloaded' }

						break
				}
			}
		})
	}

	checkUpdate(silence?: boolean) {
		if (!silence) this.update_silence = false

		ipc.app.checkUpdate.query()
	}

	download() {
		ipc.app.download.query()
	}

	install() {
		ipc.app.install.query()
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

		window.removeEventListener('blur', this.handleAppSwitch)
	}
}
