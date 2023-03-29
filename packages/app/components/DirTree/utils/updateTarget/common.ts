export default async (name: string, icon: string, file_id: string) => {
	const todo_item = (await $db.collections.todo.findOne({ selector: { id: file_id } }).exec())!

	return await todo_item.incrementalModify((doc) => {
		doc.name = name
		doc.icon = icon

		return doc
	})
}
