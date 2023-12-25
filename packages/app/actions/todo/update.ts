import type { Todo } from '@/types'

export default async (file_id: string, data: Partial<Todo.Setting>) => {
	const todo = await $db.collections.todo.findOne({ selector: { id: file_id } }).exec()

	await todo.updateCRDT({
		ifMatch: {
			$set: data
		}
	})
}
