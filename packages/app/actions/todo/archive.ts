import { difference, cloneDeep } from 'lodash-es'

import { Todo } from '@/types'
import { getDocItem } from '@/utils'

export default async (file_id: string) => {
	const archive_items = await $db.collections.todo_items
		.find({
			selector: {
				file_id: file_id,
				type: 'todo',
				status: {
					$ne: 'unchecked'
				},
				archive_time: {
					$exists: true,
					$ne: undefined,
					$lte: new Date().valueOf()
				},
				circle_enabled: false
			}
		})
		.sort({ create_at: 'asc' })
		.remove()

	const archive_items_data = archive_items.map((item) => getDocItem(item)) as Array<Todo.Todo>

	await Promise.all(archive_items_data.map((item) => $db.collections.todo_archives.insert(item)))

	const info = await $db.todo.findOne({ selector: { id: file_id } }).exec()

	if (info?.relations && info?.relations?.length && archive_items_data.length) {
		const relations = cloneDeep(info.relations)

		relations.map((item, index) => {
			relations[index].items = difference(
				item.items,
				archive_items_data.map((item) => item.id)
			)

			if (relations[index].items.length === 0) {
				relations.splice(index, 1)
			}
		})

		await info.updateCRDT({ ifMatch: { $set: { relations } } })
	}
}
