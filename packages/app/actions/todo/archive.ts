import { difference, cloneDeep } from 'lodash-es'

import { getDocItemsData } from '@/utils'

export const not_archive = [
	{ archive: { $exists: false } },
	{ archive: { $eq: false } },
	{ archive: { $eq: undefined } }
]

export default async (file_id: string) => {
	const archive_items = await $db.collections.todo_items
		.find({
			selector: {
				file_id: file_id,
				type: 'todo',
				status: {
					$ne: 'unchecked'
				},
				$or: not_archive,
				archive_time: {
					$exists: true,
					$ne: undefined,
					$lte: new Date().valueOf()
				},
				circle_enabled: false
			}
		})
		.exec()

	const archive_items_data = getDocItemsData(archive_items)

	await Promise.all(archive_items.map((item) => item.updateCRDT({ ifMatch: { $set: { archive: true } } })))

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
