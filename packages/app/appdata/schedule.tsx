import {
	AlignCenterVertical,
	CalendarCheck,
	Compass,
	GridNine,
	SquareSplitHorizontal,
	Sun
} from '@phosphor-icons/react'

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
		value: 'day',
		icon: <Sun />,
		when: ['calendar']
	},
	{
		value: 'week',
		icon: <SquareSplitHorizontal />
	},
	{
		value: 'month',
		icon: <GridNine />
	}
]
