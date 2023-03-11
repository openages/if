import { autorun, get, set } from 'mobx'

import { local } from '@matrixages/knife/storage'

export default (keys: Array<string>, instance: any) => {
	keys.map((key) => {
		const local_value = local.getItem(key)

		if (local_value) set(instance, key, local_value)
	})

	autorun(() => keys.map((key) => local.setItem(key, get(instance, key))))
}
