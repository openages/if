import { HolidayUtil, Lunar, Solar } from 'lunar-typescript'
import { match } from 'ts-pattern'

import type { Dayjs } from 'dayjs'

const west_holidays = [
	'元旦节',
	'情人节',
	'愚人节',
	'劳动节',
	'母亲节',
	'儿童节',
	'父亲节',
	'万圣节',
	'感恩节',
	'圣诞节'
]

const Index = (day: Dayjs) => {
	const holiday = HolidayUtil.getHoliday(day.year(), day.month() + 1, day.date())

	const solar = Solar.fromDate(day.toDate())
	const festival = solar.getFestivals()[0] && solar.getFestivals()[0].length <= 4 ? solar.getFestivals()[0] : false
	const global_festival = match(festival && west_holidays.includes(festival))
		// @ts-ignore
		.with(true, () => $t(`translation:common.days.${festival}`))
		.otherwise(() => false)

	return {
		value: day,
		weekday: day.format('dddd'),
		date: day.format('DD'),
		is_today: day.isToday(),
		lunar: Lunar.fromDate(day.toDate()).getDayInChinese(),
		extra:
			(holiday && {
				holiday: holiday.getName(),
				work: holiday.isWork(),
				target: holiday.getTarget() === holiday.getDay()
			}) ||
			(festival && {
				holiday: festival,
				work: false,
				target: true
			}),
		global_festival
	}
}

export default Index

export type DayDetail = ReturnType<typeof Index>
