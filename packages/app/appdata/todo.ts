import type { Todo } from '@/types'

export const todo_default_angles = {
	'en-US': ['now', 'plan', 'idea', 'wait', 'circle', 'trashbox'],
	'zh-CN': ['此刻', '计划', '想法', '等待', '循环', '垃圾箱']
}

export const getTodoDefaultData = () => {
	return {
		angles: todo_default_angles[$locale],
		tags: []
	}
}

export const getTodoFileCounts = (angles: Todo.Data['angles']) => {
	return Object.keys(angles).reduce((total, key) => {
		total += angles[key].reduce((_total, _item) => {
			if (_item.type === 'group') {
				total += _item.children.length
			} else {
				total += 1
			}

			return _total
		}, 0)

		return total
	}, 0)
}
