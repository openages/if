import dayjs from 'dayjs'
import { match } from 'ts-pattern'

import type { Todo } from '@/types'

export const getDisabledStatus = (args: {
	relations: Todo.Setting['relations']
	id: string
	status: Todo.Todo['status']
}) => {
	const { relations, id, status } = args

	if (!id || !relations.length) return false

	const relation_index = relations.findIndex(it => it.items.includes(id))

	if (relation_index !== -1) return `linked_${relation_index}`

	return status === 'checked' || status === 'closed'
}

export const getCycleSpecificDesc = (cycle: Todo.Todo['cycle']) => {
	return match(cycle.scale)
		.with('day', () =>
			// @ts-ignore
			$t('translation:todo.Input.Cycle.specific.day', { value: cycle.value })
		)
		.with('hour', () =>
			// @ts-ignore
			$t('translation:todo.Input.Cycle.specific.hour', { value: cycle.value })
		)
		.with('special', () =>
			// @ts-ignore
			$t('translation:todo.Input.Cycle.specific.special', {
				month: dayjs(cycle.value).month() + 1,
				date: dayjs(cycle.value).date()
			})
		)
		.otherwise(() => '')
}
