import { layoutByMindmap } from '@openages/stk/graph'
import { Position } from '@xyflow/react'

import getPosition from './getPosition'

import type { Node } from '@xyflow/react'
import type Model from '../model'

export default (props: Model['props'], nodes: Array<Node>) => {
	const { file_id, kanban_items } = props
	const raw_tree = { type: 'root', id: file_id, isRoot: () => true }

	const nodes_map = nodes.reduce(
		(total, item) => {
			total[item.id] = {
				width: item.computed.width,
				height: item.computed.height,
				position: { x: 0, y: 0 }
			}

			return total
		},
		{} as Record<string, { width: number; height: number; position: { x: number; y: number } }>
	)

	raw_tree['children'] = Object.keys(kanban_items).map(angle_id => {
		const angle_item = {}

		angle_item['type'] = 'angle'
		angle_item['id'] = angle_id

		angle_item['children'] = kanban_items[angle_id].items.map(item => {
			const todo_item = {}

			todo_item['type'] = 'todo_item'
			todo_item['id'] = item.id

			if (item.children) todo_item['children'] = item.children

			return todo_item
		})

		return angle_item
	})

	const target_tree = layoutByMindmap(raw_tree, {
		direction: 'LR',
		getId: item => item.id,
		getWidth: item => nodes_map[item.id].width,
		getHeight: item => {
			if (!nodes_map[item.id].height) {
				// console.log(item)
				// console.log(nodes.find(i => i.id === item.id))
			}
			return nodes_map[item.id].height
		},
		getVGap: () => 3,
		getHGap: () => 30,
		getSubTreeSep: n => {
			if (n.children) return 15

			return 0
		}
	})

	// if (Number.isNaN(target_tree.y)) {
	// 	console.log($copy(raw_tree))
	// 	// console.log($copy(nodes_map))
	// } else {
	// 	console.log('yes:', $copy(raw_tree))
	// 	// console.log('yes:', $copy(nodes_map))
	// }

	getPosition(target_tree, nodes_map)

	return nodes.map(item => {
		item.position = nodes_map[item.id].position
		item.targetPosition = Position.Left
		item.sourcePosition = Position.Right

		return item
	})
}
