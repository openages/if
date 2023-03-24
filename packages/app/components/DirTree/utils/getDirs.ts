import type { DirTree } from '@/types'

export default (dirtree: DirTree.Items, current: DirTree.Item['id']) => {
	const getDirs = (dirtree: DirTree.Items, current: DirTree.Item['id'], pid?: DirTree.Dir['id']) => {
		return dirtree.reduce((total, item) => {
			if (item.type === 'file') return total

			total.push({
				...item,
				children: getDirs(item.children, current, item.id)
			})

			return total
		}, [] as DirTree.Dirs)
	}

	return getDirs(dirtree, current)
}
