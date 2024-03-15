import dayjs from 'dayjs'

import type { Dayjs } from 'dayjs'

export default (start: Dayjs, end: Dayjs, timeline?: boolean) => {
	if (timeline) {
		const days = end.diff(start, 'hours') / 24

		return `${days}${$t('translation:common.time.d')}`
	} else {
		const duration = dayjs.duration(end.diff(start, 'minutes'), 'minutes')
		const hours = duration.hours()
		const minutes = duration.minutes()

		let target = ''

		if (hours > 0) target += `${hours}${$t('translation:common.time.h')} `
		if (minutes > 0) target += `${minutes}${$t('translation:common.time.m')}`

		return target
	}
}
