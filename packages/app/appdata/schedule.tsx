import { fillTimeText } from '@/modules/pomo/utils'
import {
	AlignCenterVertical,
	CalendarCheck,
	Compass,
	GridNine,
	SquareSplitHorizontal,
	Sun,
	Waves
} from '@phosphor-icons/react'

export const views = [
	{
		value: 'calendar',
		icon: <CalendarCheck data-key='calendar' />
	},
	{
		value: 'timeline',
		icon: <AlignCenterVertical data-key='timeline' />
	},
	{
		value: 'fixed',
		icon: <Compass data-key='fixed' />
	}
]

export const scales = [
	{
		value: 'day',
		icon: <Sun data-key='day' />,
		when: ['calendar']
	},
	{
		value: 'week',
		icon: <SquareSplitHorizontal data-key='week' />
	},
	{
		value: 'month',
		icon: <GridNine data-key='month' />
	}
]

export const scale_year = {
	value: 'year',
	icon: <Waves data-key='year' />
}

export const hours = Array.from({ length: 24 }, (_, index) => fillTimeText(index))
export const week_placeholder = []
export const day_placeholder = Array.from({ length: 7 }, _ => [])
