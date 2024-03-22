import type Model from '@/modules/todo/model'
import type { Node, Edge } from '@xyflow/react'

const position = { x: 0, y: 0 }
const edge_type = 'smoothstep'
const node_style = { with: 150, height: 18 }

export default (file_id: string, name: string, kanban_items: Model['kanban_items']) => {
	const nodes = [{ id: file_id, data: { label: name }, position }] as Array<Node>
	const edges = [] as Array<Edge>

	Object.keys(kanban_items).forEach(angle_id => {
		nodes.push({
			id: angle_id,
			data: { label: kanban_items[angle_id].dimension.value.text },
			position,
			style: node_style
		})

		edges.push({
			id: `${file_id}|${angle_id}`,
			source: file_id,
			target: angle_id,
			type: edge_type
		})

		if (kanban_items[angle_id].items.length) {
			kanban_items[angle_id].items.forEach(item => {
				nodes.push({
					id: item.id,
					data: { label: item.text },
					position,
					style: node_style
				})

				edges.push({
					id: `${angle_id}|${item.id}`,
					source: angle_id,
					target: item.id,
					type: edge_type
				})

				if (item.children?.length) {
					item.children.forEach(child => {
						nodes.push({
							id: child.id,
							data: { label: child.text },
							position,
							style: node_style
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
