export const sortLinkNodes = <T extends { id: string; prev?: string; next?: string }>(
	nodes: Array<T>,
	map?: Map<string, T>
) => {
	const node_map =
		map ??
		nodes.reduce((total, item) => {
			total.set(item.id, item)

			return total
		}, new Map<string, T>())

	let head_id: string | undefined

	for (const id in node_map) {
		if (!node_map.get(id).prev) {
			head_id = id

			break
		}
	}

	if (!head_id) return nodes

	let sorted_nodes: Array<T> = []
	let current_node_id = head_id

	while (current_node_id) {
		const node = node_map[current_node_id]

		sorted_nodes.push(node)

		current_node_id = node.next
	}

	return sorted_nodes
}
