import getDayDetails from './getDayDetails'

import type { Dayjs } from 'dayjs'
import type { DayDetail } from './getDayDetails'

export default (day: Dayjs) => {
	const start = day.startOf('week')
	const end = day.endOf('week')
	const days = [] as Array<DayDetail>

	let current = start

	while (current.isSameOrBefore(end, 'day')) {
		days.push(getDayDetails(current))

		current = current.add(1, 'day')
	}

	return days
}
