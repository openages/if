import { addTodoRefCollections } from './addTarget'

import type { DirTree } from '@/types'

const Index = async (dirtree: Array<DirTree.Item>) => {
	return Promise.all(
		dirtree.map(async (item) => {
			if (item.type === 'dir') {
				Index(item.children)
			} else {
				await addTodoRefCollections(item.id)
			}
		})
	)
}

export default Index
