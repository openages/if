import dayjs from 'dayjs'
import { match } from 'ts-pattern'

import type { Todo } from '@/types'

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
