import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string, name: string, icon: string) => {
	dirtree.map((item) => {
		if (item.id === id) {
			item.name = name
			item.icon = icon
		}

		if (item.type === 'dir') Index(item.children, id, name, icon)
	})
}

export default Index
