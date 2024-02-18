import { HolidayUtil, Lunar, Solar } from 'lunar-typescript'

import type { Dayjs } from 'dayjs'

const Index = (day: Dayjs) => {
	const holiday = HolidayUtil.getHoliday(day.year(), day.month() + 1, day.date())

	const solar = Solar.fromDate(day.toDate())
	const festival = solar.getFestivals()[0] && solar.getFestivals()[0].length <= 4 ? solar.getFestivals()[0] : false

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
			})
	}
}

export default Index

export type DayDetail = ReturnType<typeof Index>
