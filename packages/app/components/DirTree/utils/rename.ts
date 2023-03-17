import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string, name: string) => {
	dirtree.map((item) => {
		if (item.id === id) item.name = name

		if (item.type === 'dir') Index(item.children, id, name)
	})
}

export default Index
