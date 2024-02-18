import dayjs from 'dayjs'

import getDayDetails from './getDayDetails'

export default (month: number) => {
	const start_of_month = dayjs().month(month).startOf('month')
	const end_of_month = dayjs().month(month).endOf('month')
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

	return calendar_data
}
