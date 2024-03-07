import dayjs from 'dayjs'
import { flatten } from 'lodash-es'

import getDayDetails from './getDayDetails'

import type { Dayjs } from 'dayjs'

export default (day: Dayjs) => {
	const start_of_month = day.startOf('month')
	const end_of_month = day.endOf('month')
	const calendar_data = []

	let start_of_week = start_of_month.startOf('week')

	while (start_of_week.isBefore(end_of_month)) {
		const end_of_week = start_of_week.endOf('week')
		const week_data = []
		let current_date = start_of_week

		while (current_date.isBefore(end_of_week) || current_date.isSame(end_of_week)) {
			week_data.push({
				is_current_month: current_date.isSame(start_of_month, 'month'),
				...getDayDetails(current_date)
			})

			current_date = current_date.add(1, 'day')
		}

		calendar_data.push(week_data)

		start_of_week = end_of_week.add(1, 'day')
	}

	return flatten(calendar_data)
}
