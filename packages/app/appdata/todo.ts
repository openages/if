import type { Todo } from '@/types'

export const todo_default_angles = {
	'en-US': ['now', 'plan', 'idea', 'wait', 'circle', 'trashbox'],
	'zh-CN': ['此刻', '计划', '想法', '等待', '循环', '垃圾箱']
}

export const getTodoDefaultData = () => {
	const angles = todo_default_angles[$locale].reduce((total, item) => {
		total[item] = []

		return total
	}, {} as Todo.TodoData['angles'])

	return { angles, archive: [] }
}

export const getTodoFileCounts = (angles: Todo.TodoData['angles']) => {
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
