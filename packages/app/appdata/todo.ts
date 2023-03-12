import type { Todo } from '@/types'

export const todo_default_angles = {
	'en-US': ['now', 'plan', 'idea', 'wait', 'circle', 'trashbox'],
	'zh-CN': ['此刻', '计划', '想法', '等待', '循环', '垃圾箱']
}

export const getTodoDefaultAngles = () =>
	todo_default_angles[$locale].reduce((total, item) => {
		total[item] = []

		return total
	}, {} as Todo.TodoAngles)
