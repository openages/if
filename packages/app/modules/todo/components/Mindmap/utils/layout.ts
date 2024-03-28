import { layoutByMindmap } from '@openages/stk/graph'
import { Position } from '@xyflow/react'

import getPosition from './getPosition'

import type { Node } from '@xyflow/react'
import type Model from '../model'

export default (props: Model['props'], nodes: Array<Node>) => {
	const { file_id, kanban_items } = props
	const raw_tree = { isRoot: () => true, id: file_id }

	const nodes_map = nodes.reduce(
		(total, item) => {
			total[item.id] = item

			return total
		},
		{} as Record<string, Node>
	)

	raw_tree['children'] = Object.keys(kanban_items).map(angle_id => {
		const angle_item = {}

		angle_item['id'] = angle_id

		angle_item['children'] = kanban_items[angle_id].items.map(item => {
			const todo_item = {}

			todo_item['id'] = item.id

			if (item.children) todo_item['children'] = item.children

			return todo_item
		})

		return angle_item
	})

	const target_tree = layoutByMindmap(raw_tree, {
		direction: 'LR',
		getId: item => item.id,
		getWidth: item => nodes_map[item.id].computed.width,
		getHeight: item => nodes_map[item.id].computed.height,
		getVGap: () => 3,
		getHGap: () => 48
	})

	getPosition(target_tree, nodes_map)

	nodes.forEach(item => {
		item.position = nodes_map[item.id].position
		item.targetPosition = Position.Left
		item.sourcePosition = Position.Right
	})

	return nodes
}
