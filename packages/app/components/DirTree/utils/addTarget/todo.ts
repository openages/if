import { schema_$_todo_archive, schema_$_todo_items } from '@/schemas'
import { getPresetData } from '@/utils'

export const addTodoRefCollections = async (id: string) => {
	if ($db[`${id}_todo_archive`]) return

	return await $db.addCollections({
		[`${id}_todo_archive`]: { schema: schema_$_todo_archive, autoMigrate: true },
		[`${id}_todo_items`]: { schema: schema_$_todo_items, autoMigrate: true }
	})
}

export default async (name: string, icon: string, file_id: string) => {
	await $db.collections.todo.insert({
		id: file_id,
		name,
		icon,
		...getPresetData('todo')
	})

	await addTodoRefCollections(file_id)

	return
}
