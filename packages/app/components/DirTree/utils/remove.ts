import { remove } from 'lodash-es'

import type { DirTree } from '@/types'

const Index = (dirtree: DirTree.Items, id: string) => {
	dirtree.map((item) => {
		if (item.id === id) remove(dirtree, (item) => item.id === id)

		if (item.type === 'dir') Index(item.children, id)
	})
}

export default Index
