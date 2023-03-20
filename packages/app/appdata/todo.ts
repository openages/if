import type { Todo } from '@/types'

export const getTodoDefaultData = () => {
	return {
		angles: $l['todo.default_angles'],
		tags: [],
		settings: {
			auto_archiving: '3m'
		}
	} as Pick<Todo.Data, 'angles' | 'tags' | 'settings'>
}
