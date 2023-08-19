import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, args: Partial<DirTree.Item>) => {
	dirtree.map((item) => {
		if (item.id === args.id) {
			Object.keys(args).map((key) => {
				item[key] = args[key]
			})
		}

		if (item.type === 'dir') Index(item.children, args)
	})
}

export default Index
