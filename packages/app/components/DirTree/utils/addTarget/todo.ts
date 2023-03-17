import { schema_$_todo_archive, schema_$_todo_items } from '@/schemas'
import { getPresetData } from '@/utils'

export default async (name: string, file_id: string) => {
	await $db.collections.todo.insert({
		id: file_id,
		name,
		...getPresetData('todo')
	})

	await $db.addCollections({
		[`${file_id}_todo_archive`]: { schema: schema_$_todo_archive, autoMigrate: true },
		[`${file_id}_todo_items`]: { schema: schema_$_todo_items, autoMigrate: true }
	})

	return
}
