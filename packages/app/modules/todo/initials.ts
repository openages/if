import { id } from '@/utils'

import type { Todo } from '@/types'

export const getTodo = (): Omit<Todo.Todo, 'file_id' | 'angle_id' | 'sort'> => ({
	id: id(),
	type: 'todo',
	status: 'unchecked',
	text: '',
	create_at: new Date().valueOf()
})

export const getGroup = (): Omit<Todo.Group, 'file_id' | 'angle_id' | 'sort'> => ({
	id: id(),
	type: 'group',
	text: '',
	create_at: new Date().valueOf()
})
