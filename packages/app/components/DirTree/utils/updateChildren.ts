import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string, children: DirTree.Items) => {
	dirtree.map((item) => {
		if (item.id === id && item.type === 'dir') {
			item.children = children
		}

		if (item.type === 'dir') Index(item.children, id, children)
	})
}

export default Index
