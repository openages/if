import { MdCalendarViewMonth, MdOutlineViewWeek } from 'react-icons/md'

import { AlignCenterVertical, CalendarCheck, Compass } from '@phosphor-icons/react'

export const views = [
	{
		value: 'calendar',
		icon: <CalendarCheck />
	},
	{
		value: 'timeline',
		icon: <AlignCenterVertical />
	},
	{
		value: 'fixed',
		icon: <Compass />
	}
]

export const scales = [
	{
		value: 'week',
		icon: <MdOutlineViewWeek style={{ fontSize: 13 }} />
	},
	{
		value: 'month',
		icon: <MdCalendarViewMonth style={{ fontSize: 13 }} />
	}
]
