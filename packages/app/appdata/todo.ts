export const todo_default_angles = {
	'en-US': ['now', 'plan', 'idea', 'wait', 'circle', 'trashbox'],
	'zh-CN': ['此刻', '计划', '想法', '等待', '循环', '垃圾箱']
}

export const getTodoDefaultData = () => {
	return { angles: todo_default_angles[$locale], tags: [] }
}
