import dayjs from 'dayjs'

import type { Dayjs } from 'dayjs'

export const format = (v: Dayjs, ignoreDetail?: boolean) => {
	if (!v) return undefined
	if (v.valueOf() <= dayjs().valueOf()) return `${$t('translation:common.outdate')} ${v.format('YYYY-MM-DD')}`

	let detail_time = v.format('HH:mm')

	const now = dayjs()

	if (ignoreDetail) return dayjs().to(v)
	if (v.diff(now, 'month') >= 3) return v.format('YYYY-MM-DD')

	const target = (detail: string) => `${dayjs().to(v)} (${detail})`

	if (v.diff(now, 'hour') >= 24) {
		detail_time = v.format('MM-DD HH:mm')

		return target(detail_time)
	}

	return target(detail_time)
}
