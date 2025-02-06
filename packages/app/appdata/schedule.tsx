import { AlignCenterVertical, CalendarCheck, Compass, SquareSplitHorizontal } from '@phosphor-icons/react'

import type Model from '@/modules/schedule/model'

export const views = {
	week: {
		key: 'week',
		icon: <SquareSplitHorizontal data-key='week' />,
		value: { view: 'calendar', scale: 'week' },
		paid: false,
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'calendar' && scale === 'week'
	},
	month: {
		key: 'month',
		icon: <CalendarCheck data-key='month' />,
		value: { view: 'calendar', scale: 'month' },
		paid: false,
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'calendar' && scale === 'month'
	},
	timeline: {
		key: 'timeline',
		icon: <AlignCenterVertical data-key='timeline' />,
		value: { view: 'timeline', scale: 'month' },
		paid: true,
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'timeline' && scale === 'month'
	},
	fixed: {
		key: 'fixed',
		icon: <Compass data-key='fixed' />,
		value: { view: 'fixed', scale: 'week' },
		paid: true,
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'fixed' && scale === 'week'
	}
} as const

export const hours = Array.from({ length: 24 }, (_, index) => index)
export const week_placeholder = []
export const day_placeholder = Array.from({ length: 7 }, _ => [])
