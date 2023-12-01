import hotkeys from 'hotkeys-js'
import { makeAutoObservable } from 'mobx'

import { shortcuts } from '@/appdata'

import type { ShortcutEventPaths } from '@/appdata'

export default class Index {
	keys = shortcuts as Array<{
		key_bindings: string
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

	on() {
		this.keys.map(item => {
			hotkeys(item.key_bindings, item.options || {}, e => {
				e.preventDefault()

				if (item.special_key) {
					if (e.key.toLowerCase() === item.special_key) {
						$app.Event.emit(item.event_path)
					}
				} else {
					$app.Event.emit(item.event_path)
				}
			})
		})
	}

	off() {
		this.keys.map(item => hotkeys.unbind(item.key_bindings))
	}
}
