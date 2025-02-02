import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isToday from 'dayjs/plugin/isToday'
import localeData from 'dayjs/plugin/localeData'
import minMax from 'dayjs/plugin/minMax'
import objectSupport from 'dayjs/plugin/objectSupport'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import relativeTime from 'dayjs/plugin/relativeTime'
import toObject from 'dayjs/plugin/toObject'
import updateLocale from 'dayjs/plugin/updateLocale'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import type { PluginFunc } from 'dayjs'

const dayOfWeek: PluginFunc = (_, dayjs_instance) => {
	dayjs_instance.prototype.dayOfWeek = function () {
		const day = this.day()

		return day === 0 ? 7 : day
	}
}

dayjs.extend(duration)
dayjs.extend(isToday)
dayjs.extend(calendar)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(minMax)
dayjs.extend(objectSupport)
dayjs.extend(quarterOfYear)
dayjs.extend(toObject)
dayjs.extend(isoWeek)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)
dayjs.extend(isLeapYear)
dayjs.extend(dayOfWeek)

dayjs.updateLocale('en', {
	relativeTime: {
		future: 'after %s',
		past: '%s ago',
		s: 'a few seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd: '%d days',
		M: 'a month',
		MM: '%d months',
		y: 'a year',
		yy: '%d years'
	}
})

declare module 'dayjs' {
	interface Dayjs {
		dayOfWeek(): number
	}
}
