import type { Node as NodeType } from '@openages/stk/graph'

export default (node: NodeType) => {
	const target = { nodes: [] as Array<Node.Metadata>, edges: [] as Array<Edge.Metadata> }

	const transform = (node: NodeType) => {
		if (node) {
			target.nodes?.push({
				id: node.id,
				x: node.x + 250,
				y: node.y + 250,
				shape: 'circle',
				width: 16,
				height: 16,
				attrs: {
					body: {
						fill: '#5F95FF',
						stroke: 'transparent'
					}
				}
			})
		}

		if (node.children) {
			node.children.forEach((item: NodeType) => {
				target.edges?.push({
					source: node.id,
					target: item.id,
					attrs: {
						line: {
							stroke: '#A2B1C3',
							strokeWidth: 1,
							targetMarker: null
						}
					}
				})

				transform(item)
			})
		}
	}

	transform(node)

	return target
}
