import dayjs from 'dayjs'
import { match } from 'ts-pattern'

import type { Dayjs } from 'dayjs'
import type { CleanTime } from '@/types'

export const format = (v: Dayjs, ignoreDetail?: boolean) => {
	if (!v) return undefined

	if (v.valueOf() <= dayjs().valueOf()) {
		const diff = dayjs().diff(v, 'day')

		if (diff < 1) return `${$t('translation:common.outdate')} ${dayjs().to(v)}`

		const unit = match(diff > 1)
			.with(true, () => $t('translation:common.time.days'))
			.otherwise(() => $t('translation:common.time.day'))

		return `${$t('translation:common.outdate')} ${diff} ${unit}`
	}

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

export const getCleanTime = (v: CleanTime) => {
	const now = dayjs()

	return match(v)
		.with('1year', () => now.subtract(1, 'year'))
		.with('6month', () => now.subtract(6, 'month'))
		.with('3month', () => now.subtract(3, 'month'))
		.with('1month', () => now.subtract(1, 'month'))
		.with('15days', () => now.subtract(15, 'day'))
		.with('1week', () => now.subtract(1, 'week'))
		.exhaustive()
}
