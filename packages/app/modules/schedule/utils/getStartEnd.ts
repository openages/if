import type { Dayjs } from 'dayjs'

export default (date: Dayjs, start: number, length: number, timeline?: boolean, year_scale?: boolean) => {
	if (timeline) {
		let date_start = null as unknown as Dayjs
		let start_time = null as unknown as Dayjs
		let end_time = null as unknown as Dayjs

		if (!year_scale) {
			date_start = date.startOf('day')
			start_time = date_start.add(start * 12, 'hours')
			end_time = start_time.add(length * 12, 'hours')
		} else {
			date_start = date.startOf('year')
			start_time = date_start.add(start, 'month')
			end_time = start_time.add(length, 'month')
		}

		return { start_time: start_time.valueOf(), end_time: end_time.valueOf() }
	} else {
		const date_start = date.startOf('day')
		const start_time = date_start.add(start * 20, 'minutes')
		const end_time = start_time.add(length * 20, 'minutes')

		return { start_time: start_time.valueOf(), end_time: end_time.valueOf() }
	}
}
