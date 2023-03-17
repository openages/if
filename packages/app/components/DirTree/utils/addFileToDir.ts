import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string, file: DirTree.File) => {
	dirtree.map((item) => {
		if (item.id === id && item.type === 'dir') {
			item.children.push(file)
		}
	})
}

export default Index
