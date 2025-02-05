import { AlignCenterVertical, CalendarCheck, Compass, GridNine, SquareSplitHorizontal } from '@phosphor-icons/react'

import type Model from '@/modules/schedule/model'

export const views = {
	week: {
		key: 'week',
		icon: <SquareSplitHorizontal data-key='week' />,
		value: { view: 'calendar', scale: 'week' },
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'calendar' && scale === 'week'
	},
	month: {
		key: 'month',
		icon: <CalendarCheck data-key='month' />,
		value: { view: 'calendar', scale: 'month' },
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'calendar' && scale === 'month'
	},
	timeline: {
		key: 'timeline',
		icon: <AlignCenterVertical data-key='timeline' />,
		value: { view: 'timeline', scale: 'month' },
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'timeline' && scale === 'month'
	},
	fixed: {
		key: 'fixed',
		icon: <Compass data-key='fixed' />,
		value: { view: 'fixed', scale: 'week' },
		getActive: (view: Model['view'], scale: Model['scale']) => view === 'fixed' && scale === 'week'
	}
} as const

export const hours = Array.from({ length: 24 }, (_, index) => index)
export const week_placeholder = []
export const day_placeholder = Array.from({ length: 7 }, _ => [])
