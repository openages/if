export default async (id: string) => {
	$db.collections.todo.findOne({ selector: { id } }).remove()
	$db.collections[`${id}_todo_archive`].remove()
}
