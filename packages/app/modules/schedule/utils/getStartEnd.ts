import type { Dayjs } from 'dayjs'

export default (date: Dayjs, start: number, length: number) => {
	const date_start = date.startOf('day')
	const start_time = date_start.add(start * 20, 'minutes')
	const end_time = start_time.add(length * 20, 'minutes')

	return { start_time: start_time.valueOf(), end_time: end_time.valueOf() }
}
