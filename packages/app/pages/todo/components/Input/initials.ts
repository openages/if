import { id } from '@/utils'

import type { Todo } from '@/types'

export const getTodo = (current_angle_id: string): Todo.Todo => ({
	id: id(),
	type: 'todo',
	status: 'unchecked',
	text: '',
	angle_id: current_angle_id,
	create_at: new Date().valueOf()
})

export const getGroup = (current_angle_id: string): Todo.Group => ({
	id: id(),
	type: 'group',
	text: '',
	angle_id: current_angle_id,
	create_at: new Date().valueOf()
})
