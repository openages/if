import { schema_$_todo_archive, schema_$_todo_items } from '@/schemas'
import { getPresetData } from '@/utils'

const addTodoItemsCollection = async (file_id: string) => {
	return await $db.addCollections({
		[`${file_id}_todo_items`]: { schema: schema_$_todo_items, autoMigrate: true }
	})
}

const addTodoAchiveCollection = async (file_id: string) => {
	return await $db.addCollections({
		[`${file_id}_todo_archive`]: { schema: schema_$_todo_archive, autoMigrate: true }
	})
}

export default async (name: string, file_id: string) => {
	await addTodoItemsCollection(file_id)
	await addTodoAchiveCollection(file_id)

	await $db.collections.todo.insert({
		id: file_id,
		name,
		...getPresetData('todo')
	})

	return
}
