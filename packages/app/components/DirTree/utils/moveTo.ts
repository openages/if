import remove from './remove'

import type { DirTree } from '@/types'

const Index = (current: DirTree.Item, target_id: string, items: DirTree.Items) => {
	remove(items, current.id)

	const find = (dirtree: DirTree.Items) => {
		dirtree.map((item) => {
			if (item.id === target_id && item.type === 'dir') item.children.push(current)

			if (item.type === 'dir') find(item.children)
		})
	}

	find(items)
}

export default Index
