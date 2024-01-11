import { flatten } from 'lodash-es'

import { todos_cn, todos_en } from './data'

import type { Todo } from '@/types'

export default (file_id: string, angles: Array<Todo.Angle>, type: 'cn' | 'en') => {
	const todos = type === 'cn' ? todos_cn : todos_en

	angles.map((item, index) => {
		todos[index].map(todo => {
			todo['file_id'] = file_id
			todo['angle_id'] = item.id
		})
	})

	$db.todo_items.bulkInsert(flatten(todos))
}
