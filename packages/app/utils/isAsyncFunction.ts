import { isFunction, toString } from 'lodash-es'

export default (func: Function) => {
	if (!isFunction(func)) return false

	return toString(func).includes('async ')
}
