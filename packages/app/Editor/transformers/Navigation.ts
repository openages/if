import NavigationNode from '../plugins/Navigation/Node'
import { $isNavigationNode } from '../plugins/Navigation/utils'

import type { ElementTransformer } from '@lexical/markdown'

export default {
	type: 'element',
	regExp: new RegExp(''),
	dependencies: [NavigationNode],
	export(node: NavigationNode) {
		if (!$isNavigationNode(node)) return

		let max_value = 7

		node.__items.forEach(item => {
			const [, , type] = item
			const type_value = parseInt(type.replace('h', ''))

			if (type_value < max_value) max_value = type_value
		})

		const target = node.__items
			.map(([_, title, type]) => {
				const type_value = parseInt(type.replace('h', ''))
				const padding_value = type_value - max_value

				const padding = Array.from({ length: padding_value }, _ => '  ')
				const target_title = title.replace(/\s/g, '')

				return padding + '- ' + `[${target_title}](#${target_title})`
			})
			.join('\n')

		return target
	},
	replace() {
		return null
	}
} as ElementTransformer
