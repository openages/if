import { intersection } from 'lodash-es'

const mergeAnyOf = (arr: Array<any>) => {
	return arr.reduce((total, item) => {
		if (total['required'] && item['required']) {
			total = { ...total, ...item, required: intersection(total['required'], item['required']) }
		} else {
			total = { ...total, ...item }
		}

		return total
	}, {} as any)
}

const Index = (definitions: any, source: any): any => {
	if (!definitions) return undefined

	if (Array.isArray(definitions)) {
		return definitions.map((it: any) => Index(it, source))
	} else {
		if (typeof definitions === 'object') {
			if (typeof definitions === 'object' && definitions['$ref']) {
				const $ref = definitions['$ref'].replace('#/definitions/', '')

				return Index(source[$ref], source)
			} else if (typeof definitions === 'object' && definitions['anyOf']) {
				const anyOf = definitions['anyOf']
				let target = anyOf

				if (anyOf[0]['$ref']) {
					target = anyOf.map((item: any) => {
						const $ref = item['$ref'].replace('#/definitions/', '')

						return Index(source[$ref], source)
					})
				}

				return mergeAnyOf(target)
			} else {
				return Object.keys(definitions).reduce((total, key) => {
					const item = definitions[key]

					total[key] = Index(item, source)

					return total
				}, {} as any)
			}
		} else {
			return definitions
		}
	}
}

export default Index
