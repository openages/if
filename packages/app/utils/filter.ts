import { isArray } from 'lodash-es'

export const getComputedStyleValue = (el: Element, property: string) => {
	return Number(getComputedStyle(el).getPropertyValue(property).replace('px', ''))
}

export const getExsitValues = (v: any) => {
	Object.keys(v).map((key) => {
		if (v[key] === undefined || v[key] === null) {
			delete v[key]
		}

		if (isArray(v[key])) {
			if (!v[key].length) {
				delete v[key]
			}
		}
	})

	return v
}
