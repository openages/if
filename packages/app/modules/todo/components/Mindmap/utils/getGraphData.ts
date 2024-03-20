import { layoutByMindmap } from '@openages/stk/graph'

import type Model from '@/modules/todo/model'
import type { G } from '@/types'

export default (name: string, file_id: string, kanban_items: Model['kanban_items']) => {
	const target = { id: file_id } as G.Node

	target['children'] = Object.keys(kanban_items).reduce((total, angle_id) => {
		total.push({
			id: angle_id,
			children: kanban_items[angle_id].items
		})

		return total
	}, [])

	return layoutByMindmap(target, {
		direction: 'LR',
		indent: 12,
		getWidth: () => 16,
		getHeight: () => 16,
		getHGap: () => 90,
		getVGap: () => 6,
		getSide: () => 'right'
	})

	// return layoutByMindmap(target, {
	// 	direction: 'LR',
	// 	getWidth: () => 16,
	// 	getHeight: () => 16,
	// 	getHGap: () => 60,
	// 	getVGap: () => 6,
	// 	getSide: () => 'right'
	// })
}
