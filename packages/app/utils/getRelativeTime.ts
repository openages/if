import dayjs from 'dayjs'

export default (v: number) => {
	const time = dayjs(v)
	const relative_time = dayjs().diff(time, 'minute')

	if (relative_time < 1) {
		return { x: 'just_now' }
	} else if (relative_time < 60) {
		return { x: relative_time, unit: 'minutes' }
	} else if (relative_time < 24 * 60) {
		return { x: Math.floor(relative_time / 60), unit: relative_time < 2 * 60 ? 'hour' : 'hours' }
	} else if (relative_time < 7 * 24 * 60) {
		return {
			x: Math.floor(relative_time / (24 * 60)),
			unit: relative_time < 2 * 24 * 60 ? 'day' : 'days'
		}
	} else if (relative_time < 30 * 24 * 60) {
		return {
			x: Math.floor(relative_time / (7 * 24 * 60)),
			unit: relative_time < 2 * 24 * 60 ? 'week' : 'weeks'
		}
	} else {
		return { x: time.format('YYYY-MM-DD HH:mm:ss') }
	}
}
