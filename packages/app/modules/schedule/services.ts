import { id } from '@/utils'

import type { Schedule } from '@/types'
import type { MangoQuerySelector } from 'rxdb'

export const getTimeBlock = (id: string) => $db.schedule_items.findOne(id).exec()

export const getTimeBlocks = (file_id: string, selector: MangoQuerySelector<Schedule.Item>) => {
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
