import { schema_$_todo_archive, schema_$_todo_items } from '@/schemas'

export default async (id: string) => {
	if ($db[`${id}_todo_archive`]) return

	return await $db.addCollections({
		[`${id}_todo_archive`]: { schema: schema_$_todo_archive, autoMigrate: true },
		[`${id}_todo_items`]: { schema: schema_$_todo_items, autoMigrate: true }
	})
}