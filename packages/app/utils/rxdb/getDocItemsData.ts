import type { RxDB } from '@/types'
import type { RxDocument } from 'rxdb'

export default <T>(arr: RxDB.ItemsDoc<T>) => {
	return arr.map(item => {
		const target = item.toMutableJSON()

		delete target['crdts']

		return target
	})
}

export const getDocItem = <T>(item: RxDocument<T>) => {
	const target = item.toMutableJSON()

	delete target['crdts']

	return target
}
