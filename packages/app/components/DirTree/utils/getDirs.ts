import remove from './remove'

import type { DirTree } from '@/types'

export default (dirtree: DirTree.Items, current: DirTree.Item['id']) => {
	let parent_id: DirTree.Item['id'] | null = null

	const getDirs = (dirtree: DirTree.Items, current: DirTree.Item['id'], pid?: DirTree.Dir['id']) => {
		return dirtree.reduce((total, item) => {
			if (item.id === current) {
				if (pid) parent_id = pid

				return total
			}

			if (item.type === 'file') return total

			total.push({
				...item,
				children: getDirs(item.children, current, item.id)
			})

			return total
		}, [] as DirTree.Dirs)
	}

	const dirs = getDirs(dirtree, current)

	if (parent_id) remove(dirs, parent_id)

	return dirs
}
