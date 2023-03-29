import type { Todo } from '@/types'

export const getTodoDefaultData = () => {
	return {
		angles: $l['todo.default_angles'],
		angle: $l['todo.default_angles'][0],
		tags: [],
		settings: {
			auto_archiving: '3m'
		}
	} as Pick<Todo.Data, 'angles' | 'angle' | 'tags' | 'settings'>
}
