export default async (id: string) => {
	$db.collections.todo.findOne({ selector: { id } }).remove()

	const todo_archive = `${id}_todo_archive` as const

	if (!$db.collections[todo_archive]) return

	$db.collections[todo_archive].remove()
}
