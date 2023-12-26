import dayjs from 'dayjs'
import { P, match } from 'ts-pattern'

import type { Todo } from '@/types'
import type { RxDocument } from 'rxdb'

export const not_cycle = [
	{ cycle_enabled: { $exists: false } },
	{ cycle_enabled: { $eq: false } },
	{ cycle_enabled: { $eq: undefined } }
]

const recycle = async (item: RxDocument<Todo.Todo>) => {
	const uncycle = () => {
		return item.updateCRDT({
			ifMatch: {
				$set: {
					status: 'unchecked',
					archive: false,
					archive_time: undefined,
					recycle_time: undefined
				}
			}
		})
	}

	return match(item.cycle)
		.with({ scale: P.union('minute', 'hour', 'day', 'month', 'year') }, async () => {
			return uncycle()
		})
		.with({ scale: P.union('week', 'quarter') }, async ({ scale }) => {
			const target = scale == 'week' ? dayjs().isoWeekday() : dayjs().quarter()

			if (item.cycle?.exclude?.length) {
				if (!item.cycle.exclude.includes(target)) {
					return uncycle()
				}
			}
		})
		.exhaustive()
}

export default async (file_id: string) => {
	const cycle_items = await $db.todo_items
		.find({
			selector: {
				file_id,
				type: 'todo',
				status: 'checked',
				recycle_time: {
					$exists: true,
					$ne: undefined,
					$lte: new Date().valueOf()
				}
			}
		})
		.exec()

	await Promise.all(cycle_items.map(item => recycle(item as RxDocument<Todo.Todo>)))
}
