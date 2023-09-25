import { autorun, get, set } from 'mobx'

import { local } from '@openages/craftkit'

type KeyMap = Record<string, string | ((v: any) => any)> | string

const getKey = (key_map: KeyMap) => {
	if (typeof key_map === 'string') {
		return { local_key: key_map, proxy_key: key_map }
	} else {
		const temp = Object.keys(key_map)
		const key = temp[0]
		const value = key_map[key]

		if (typeof value === 'function') {
			return { local_key: key, proxy_key: key, getHandler: value }
		}

		return { local_key: key, proxy_key: value }
	}
}

export default (keys: Array<KeyMap>, instance: any) => {
	keys.map((key) => {
		const target = getKey(key)
		const local_value = local.getItem(target.local_key)

		if (local_value) {
			if (target.getHandler) {
				set(instance, target.proxy_key, target.getHandler(local_value))
			} else {
				set(instance, target.proxy_key, local_value)
			}
		}
	})

	return autorun(() =>
		keys.map((key) => {
			local.setItem(getKey(key).local_key, get(instance, getKey(key).proxy_key))
		})
	)
}
