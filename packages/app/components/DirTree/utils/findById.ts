import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string) => {
	let target: DirTree.Item | null = null

	const find = (dirtree: DirTree.Items) => {
		for (let index = 0; index < dirtree.length; index++) {
			const item = dirtree[index]

			if (item.id === id) {
				target = item

				break
			} else {
				if (item.type === 'dir') find(item.children)
			}
		}
	}

	find(dirtree)

	return target
}

export default Index
