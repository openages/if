import type { DirTree } from '@/types'

const Index = (input: DirTree.Items) => {
	const idToNodeMap = new Map()

	for (const item of input) {
		const { id, pid } = item
		const node = { id }

		if (pid) {
			const parentNode = idToNodeMap.get(pid)

			if (!parentNode.children) {
				parentNode.children = []
			}

			parentNode.children.push(node)
		}

		idToNodeMap.set(id, node)
	}

	const roots = []

	for (const item of input) {
		const { id } = item

		if (!item.pid) {
			roots.push(idToNodeMap.get(id))
		}
	}

	return roots
}

export default Index
