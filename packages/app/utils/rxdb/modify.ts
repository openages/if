import { omit } from 'lodash-es'

export default (v: any) => (item: any) => {
	const data = omit(v, 'id')

	Object.keys(data).map((key) => {
		item[key] = data[key]
	})

	return item
}
