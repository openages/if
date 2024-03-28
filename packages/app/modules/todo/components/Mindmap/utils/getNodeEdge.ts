import type { Node, Edge } from '@xyflow/react'

import type Model from '../model'

const position = { x: 0, y: 0 }
const edge_type = 'smoothstep'

export default (props: Model['props']) => {
	const { file_id, name, kanban_items, tags, angles, check, insert, update, tab, moveTo, remove, showDetailModal } =
		props
	const nodes = [{ id: file_id, data: { label: name }, position }] as Array<Node>
	const edges = [] as Array<Edge>

	Object.keys(kanban_items).forEach(angle_id => {
		nodes.push({
			id: angle_id,
			data: { label: kanban_items[angle_id].dimension.value.text },
			position
		})

		edges.push({
			id: `${file_id}|${angle_id}`,
			source: file_id,
			target: angle_id,
			type: edge_type
		})

		if (kanban_items[angle_id].items.length) {
			kanban_items[angle_id].items.forEach((item, index) => {
				nodes.push({
					type: 'TodoItem',
					id: item.id,
					data: {
						file_id,
						item,
						index,
						dimension_id: angle_id,
						tags,
						angles,
						kanban_mode: 'angle',
						useByMindmap: true,
						check,
						insert,
						update,
						tab,
						moveTo,
						remove,
						showDetailModal
					},
					position
				})

				edges.push({
					id: `${angle_id}|${item.id}`,
					source: angle_id,
					target: item.id,
					type: edge_type
				})

				if (item.children?.length) {
					item.children.forEach((child, children_index) => {
						nodes.push({
							type: 'ChildrenItem',
							id: child.id,
							data: {
								item: child,
								index,
								children_index,
								dimension_id: angle_id,
								useByMindmap: true,
								update,
								tab
							},
							position
						})

						edges.push({
							id: `${item.id}|${child.id}`,
							source: item.id,
							target: child.id,
							type: edge_type
						})
					})
				}
			})
		}
	})

	return { nodes, edges }
}
