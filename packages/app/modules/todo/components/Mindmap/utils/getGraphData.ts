import { graphlib, layout } from '@dagrejs/dagre'

import getNodeEdge from './getNodeEdge'

const graph = new graphlib.Graph()

graph.setDefaultEdgeLabel(() => ({}))

import type Model from '@/modules/todo/model'
import type { Position } from '@xyflow/react'

const width = 150
const height = 18

export default (file_id: string, name: string, kanban_items: Model['kanban_items']) => {
	const { nodes, edges } = getNodeEdge(file_id, name, kanban_items)

	graph.setGraph({ rankdir: 'LR', nodesep: 6 })

	nodes.forEach(item => graph.setNode(item.id, { width, height }))
	edges.forEach(item => graph.setEdge(item.source, item.target))

	layout(graph)

	nodes.forEach(item => {
		const graph_node = graph.node(item.id)

		item.targetPosition = 'left' as Position.Left
		item.sourcePosition = 'right' as Position.Right

		item.position = { x: graph_node.x - width / 2, y: graph_node.y - height / 2 }

		return item
	})

	return { nodes, edges }
}
