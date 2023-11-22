import type { DirTree } from '@/types'

const Index = (input: DirTree.Items) => {
	const id_to_node_map = new Map()

	function build_hierarchy(node: DirTree.TransformedItem) {
		const children = input.filter((item) => item.pid === node.id)

		if (children.length > 0) {
			node.children = []

			for (const child of children) {
				const child_node = id_to_node_map.get(child.id)

				build_hierarchy(child_node)

				node.children.push(child_node)
			}

			node.children.sort((a, b) => a.sort - b.sort)
		}
	}

	for (const item of input) {
		const { id } = item

		id_to_node_map.set(id, item)
	}

	const roots = [] as Array<DirTree.TransformedItem>

	for (const item of input) {
		if (!item.pid) {
			const root_node = id_to_node_map.get(item.id)

			build_hierarchy(root_node)

			roots.push(root_node)
		}
	}

	roots.sort((a, b) => a.sort - b.sort)

	return roots
}

export default Index
