import { getCleanTime, getDocItemsData, id } from '@/utils'
import { confirm } from '@/utils/antd'

import type { Schedule, CleanTime } from '@/types'
import type { MangoQuerySelector } from 'rxdb'

export const getTimeBlock = (id: string) => $db.schedule_items.findOne(id).exec()

export const getTimeBlocks = (
	file_id: string,
	selector: MangoQuerySelector<Schedule.Item>,
	filter_tags: Array<string>
) => {
	if (filter_tags.length) selector['tag'] = { $in: filter_tags }

	return $db.schedule_items.find({ selector: { file_id, ...selector } })
}

export const addTimeBlock = (file_id: string, args: Partial<Schedule.Item>) => {
	return $db.schedule_items.insert({
		id: id(),
		file_id,
		tag: '',
		text: '',
		todos: [],
		...args
	} as Schedule.Item)
}

export const updateTimeBlock = async (id: string, v: Partial<Schedule.Item>) => {
	const doc = await getTimeBlock(id)

	return doc.updateCRDT({ ifMatch: { $set: v } })
}

export const removeTimeBlock = async (id: string) => {
	return $db.schedule_items.findOne(id).remove()
}

export const getTagTimeBlockCounts = async (file_id: string, tag: string) => {
	return $db.schedule_items.count({ selector: { file_id, tag } }).exec()
}

export const removeTag = async (file_id: string, tag: string) => {
	return $db.schedule_items.find({ selector: { file_id, tag } }).remove()
}

export const cleanByTime = async (file_id: string, v: CleanTime) => {
	const target_time = getCleanTime(v)

	const query = $db.schedule_items.find({
		selector: {
			file_id,
			end_time: { $lte: target_time.valueOf() }
		}
	})

	const remove_items = await query.exec()

	const res = await confirm({
		id: file_id,
		title: $t('translation:common.notice'),
		// @ts-ignore
		content: $t('translation:common.clean.confirm_with_date', {
			date: target_time.format('YYYY-MM-DD'),
			counts: remove_items.length
		})
	})

	if (!res || !remove_items.length) return false

	await query.remove()

	await $db.schedule_items.bulkClean(getDocItemsData(remove_items).map(item => item.id))
}
