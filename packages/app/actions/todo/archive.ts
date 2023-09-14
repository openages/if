import { difference, cloneDeep } from 'lodash-es'

import { Todo } from '@/types'

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

	const archive_data = archive_items.map((item) => item.toMutableJSON()) as Array<Todo.Todo>

	await $db.collections.todo_archives.bulkInsert(
		archive_data.map((item) => {
			item.create_at = new Date().valueOf()

			return item
		})
	)

	const info = await $db.todo.findOne({ selector: { id: file_id } }).exec()

	if (info?.relations && info?.relations?.length && archive_data.length) {
		const relations = cloneDeep(info.relations)

		relations.map((item, index) => {
			relations[index].items = difference(
				item.items,
				archive_data.map((item) => item.id)
			)

			if (relations[index].items.length === 0) {
				relations.splice(index, 1)
			}
		})

		await info.incrementalPatch({ relations })
	}
}
