import { difference } from 'lodash-es'

import { getDocItemsData } from '@/utils'

import type { Todo } from '@/types'

export const not_archive = [{ archive: { $eq: false } }]

export default async (file_id: string) => {
	const archive_items = await $db.todo_items
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
				$or: not_archive
			}
		})
		.exec()

	const archive_items_data = getDocItemsData(archive_items)

	await Promise.all(archive_items.map(item => item.updateCRDT({ ifMatch: { $set: { archive: true } } })))

	const module_setting = await $db.module_setting.findOne({ selector: { file_id } }).exec()

	const info = JSON.parse(module_setting.setting) as Todo.Setting

	if (info?.relations && info?.relations?.length && archive_items_data.length) {
		const relations = $copy(info.relations)

		relations.map((item, index) => {
			relations[index].items = difference(
				item.items,
				archive_items_data.map(item => item.id)
			)

			if (relations[index].items.length === 0) {
				relations.splice(index, 1)
			}
		})

		await module_setting.updateCRDT({ ifMatch: { $set: { setting: JSON.stringify({ ...info, relations }) } } })
	}
}
