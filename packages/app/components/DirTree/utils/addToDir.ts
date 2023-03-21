import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string, target: DirTree.Item) => {
	dirtree.map((item) => {
		if (item.type === 'file') return

		if (item.id === id) {
			item.children.push(target)
		} else {
			Index(item.children, id, target)
		}
	})
}

export default Index
