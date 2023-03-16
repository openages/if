export default async (id: string) => {
	await $db.collections[`${id}_todo_items`]?.remove()
	await $db.collections[`${id}_todo_archive`]?.remove()
	await $db.collections.todo.findOne({ selector: { id } }).remove()
}
