import hotkeys from 'hotkeys-js'
import { makeAutoObservable } from 'mobx'

import { shortcuts } from '@/appdata'

import type { ShortcutEventPaths } from '@/appdata'

export default class Index {
	keys = shortcuts as Array<{
		key_bindings: string | { darwin: string; win32: string }
		event_path: ShortcutEventPaths
		readonly: boolean
		special_key?: string
		options?: {
			scope?: string
			element?: HTMLElement | null
			keyup?: boolean | null
			keydown?: boolean | null
			capture?: boolean
			splitKey?: string
		}
	}>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		this.on()
	}

	getKeybinds(key_bindings: Index['keys'][number]['key_bindings']) {
		return typeof key_bindings === 'string' ? key_bindings : key_bindings[window?.$shell?.platform || 'darwin']
	}

	on() {
		this.keys.map(item => {
			const key_bindings = this.getKeybinds(item.key_bindings)

			hotkeys(key_bindings, item.options || {}, e => {
				if (item.special_key) {
					if (e.key.toLowerCase() === item.special_key) {
						e.preventDefault()

						$app.Event.emit(item.event_path)
					}
				} else {
					e.preventDefault()

					$app.Event.emit(item.event_path)
				}
			})
		})
	}

	off() {
		this.keys.map(item => hotkeys.unbind(this.getKeybinds(item.key_bindings)))
	}
}
