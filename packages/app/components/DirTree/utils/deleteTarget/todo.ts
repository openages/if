import type { DirTree } from '@/types'

const deleteTodoFile = async (id: string) => {
	await $db.collections.todo.findOne({ selector: { id } }).remove()
	await $db.collections[`${id}_todo_items`].remove()
	await $db.collections[`${id}_todo_archive`].remove()
}

const Index = async (focusing_item: DirTree.Item) => {
	if (focusing_item.type === 'file') return await deleteTodoFile(focusing_item.id)

	await Promise.all(focusing_item.children.map(async (item) => await Index(item)))
}

export default Index
