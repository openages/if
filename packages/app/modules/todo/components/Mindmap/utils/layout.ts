import { layoutByMindmap } from '@openages/stk/graph'
import { Position } from '@xyflow/react'

import getPosition from './getPosition'

import type { IPropsMindmap } from '@/modules/todo/types'

import type { Node } from '@xyflow/react'

export default (args: Pick<IPropsMindmap, 'file_id' | 'kanban_items'>, nodes: Array<Node>) => {
	const { file_id, kanban_items } = args
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

			if (item.children && item.children.length) todo_item['children'] = item.children

			return todo_item
		})

		return angle_item
	})

	const target_tree = layoutByMindmap(raw_tree, {
		direction: 'LR',
		getId: item => item.id,
		getWidth: item => nodes_map[item.id].width,
		getHeight: item => nodes_map[item.id].height,
		getVGap: () => 3,
		getHGap: item => {
			if (nodes_map[item.id].width > 57 && item.type !== 'todo_item') {
				const width = nodes_map[item.id].width
				const overflow = width - 57

				if (item.type === 'root' && overflow > 30) {
					if (overflow >= 54) return 54

					return overflow
				}

				if (overflow > 30) {
					return overflow + width * 0.1
				} else {
					return 36
				}
			}

			return 30
		},
		getSubTreeSep: n => {
			if (n.children && n.children.length) return 15

			return 0
		}
	})

	getPosition(target_tree, nodes_map)

	return nodes.map(item => {
		item.position = nodes_map[item.id].position
		item.computed.positionAbsolute = item.position
		item.targetPosition = Position.Left
		item.sourcePosition = Position.Right

		const symbols = Object.getOwnPropertySymbols(item)

		for (const symbol of symbols) {
			delete item[symbol]
		}

		return item
	})
}
