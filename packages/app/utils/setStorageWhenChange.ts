import { autorun, get, set } from 'mobx'

import { local } from '@matrixages/knife/storage'

type KeyMap = Record<string, string> | string

const getKey = (key_map: KeyMap) => {
	if (typeof key_map === 'string') {
		return { local_key: key_map, proxy_key: key_map }
	} else {
		const temp = Object.keys(key_map)

		return { local_key: temp[0], proxy_key: key_map[temp[0]] }
	}
}

export default (keys: Array<KeyMap>, instance: any) => {
	keys.map((key) => {
		const local_value = local.getItem(getKey(key).local_key)

		if (local_value) set(instance, getKey(key).proxy_key, local_value)
	})

	autorun(() => keys.map((key) => local.setItem(getKey(key).local_key, get(instance, getKey(key).proxy_key))))
}
