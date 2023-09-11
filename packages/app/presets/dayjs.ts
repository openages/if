import 'dayjs/locale/zh-cn'

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
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
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'

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
dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(relativeTime)
