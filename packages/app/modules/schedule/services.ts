import { id } from '@/utils'

import type { Schedule } from '@/types'
import type { MangoQuerySelector } from 'rxdb'

export const getTimeBlock = (id: string) => $db.schedule_items.findOne(id).exec()

export const getTimeBlocks = (file_id: string, selector: MangoQuerySelector<Schedule.Item>) => {
	return $db.schedule_items.find({ selector: { file_id, ...selector } })
}

export const addTimeBlock = (
	file_id: string,
	type: Schedule.Item['type'],
	start_time: Schedule.Item['start_time'],
	end_time: Schedule.Item['end_time']
) => {
	return $db.schedule_items.insert({
		id: id(),
		file_id,
		type,
		tag: '',
		text: '',
		todos: [],
		start_time,
		end_time
	})
}

export const updateTimeBlock = async (id: string, v: Partial<Schedule.Item>) => {
	const doc = await getTimeBlock(id)

	return doc.updateCRDT({ ifMatch: { $set: v } })
}
