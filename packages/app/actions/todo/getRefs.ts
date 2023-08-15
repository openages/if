import addRefs from './addRefs'

import type { DirTree } from '@/types'

const Index = async (dirtree: Array<DirTree.Item>) => {
	return Promise.all(
		dirtree.map(async (item) => {
			if (item.type === 'dir') {
				return await Index(item.children)
			} else {
				return await addRefs(item.id)
			}
		})
	)
}

export default Index
