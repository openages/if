import { local } from '@openages/stk'

import type { DirTree } from '@/types'

const deleteTodoFile = async (id: string) => {
	await $db.collections.todo.findOne({ selector: { id } }).remove()
	await $db.collections.todo_items.find({ selector: { file_id: id } }).remove()
	await $db.collections.todo_archives.find({ selector: { file_id: id } }).remove()
}

const Index = async (focusing_item: DirTree.Item, current_item: string, module: string) => {
	if (focusing_item.id === current_item) $app.Event.emit(`${module}/dirtree/removeCurrentItem`)
	if (focusing_item.type === 'dir') $app.Event.emit(`${module}/dirtree/removeOpenFolder`, focusing_item.id)

	if (focusing_item.type === 'file') {
		$app.Event.emit('global.tabs.removeFile', focusing_item.id)

		local.removeItem(`${focusing_item.id}_todo_current_angle_id`)

		return await deleteTodoFile(focusing_item.id)
	}

	if (focusing_item?.children) {
		await Promise.all(focusing_item.children.map(async (item) => await Index(item, current_item, module)))
	}
}

export default Index
