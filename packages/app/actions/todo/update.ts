import type { Todo } from '@/types'

export default async (file_id: string, data: Partial<Todo.Data>) => {
	const todo_item = (await $db.collections.todo.findOne({ selector: { id: file_id } }).exec())!

	await todo_item.incrementalModify((doc) => {
		Object.keys(data).map((key) => {
			doc[key] = data[key]
		})

		return doc
	})
}
