import getDayDetails from './getDayDetails'

import type { Dayjs } from 'dayjs'
import type { DayDetail } from './getDayDetails'

export default (day: Dayjs) => {
	const days = [day, day.add(1, 'day'), day.add(2, 'day')] as Array<Dayjs>

	return days.reduce(
		(total, item) => {
			total.push(getDayDetails(item))

			return total
		},
		[] as Array<DayDetail>
	)
}
