import type { Schedule } from '@/types'

import type Model from '../model'

import type { MutableRefObject } from 'react'

export interface IProps {
	id: string
}

export interface IPropsHeader {
	view: Model['view']
	scale: Model['scale']
	current: Model['current']
	visible_task_panel: Model['visible_task_panel']
	step: Model['step']
	toggleVisibleTaskPanel: () => boolean
	changeView: (v: Model['view']) => void
	changeScale: (v: Model['scale']) => void
	changeCurrent: (v: Model['current']) => void
}

export interface IPropsHeaderLeft
	extends Pick<
		IPropsHeader,
		'view' | 'scale' | 'visible_task_panel' | 'toggleVisibleTaskPanel' | 'changeView' | 'changeScale'
	> {}

export interface IPropsHeaderCenter {
	current: Model['current']
	step: Model['step']
}

export interface IPropsDateScale {
	scale: Model['scale']
	days: Model['days']
}

export interface IPropsCalendarView {
	container: MutableRefObject<HTMLDivElement>
	view: Model['view']
	scale: Model['scale']
	calendar_days: Model['calendar_days']
	timeblock_copied: Model['timeblock_copied']
	addTimeBlock: Model['addTimeBlock']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: (v: Omit<Schedule.CalendarItem, 'id'>) => void
}

export interface IPropsCalendarViewDay {
	container: MutableRefObject<HTMLDivElement>
	day: Schedule.CalendarDay
	counts: number
	index: number
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
}

export interface IPropsCalendarViewTimeBlock {
	item: Schedule.CalendarItem
	signal?: boolean
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
}

export interface IPropsCalendarViewTimeBlockDetail {
	item: Schedule.CalendarItem
	updateTimeBlock: Model['updateTimeBlock']
}

export interface IPropsCalendarContextMenu {
	view: Model['view']
	timeblock_copied: Model['timeblock_copied']
	addTimeBlock: Model['addTimeBlock']
}
