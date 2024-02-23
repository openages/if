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
	tags: Schedule.Setting['tags']
	filter_tags: Model['filter_tags']
	step: Model['step']
	toggleVisibleTaskPanel: () => boolean
	changeView: (v: Model['view']) => void
	changeScale: (v: Model['scale']) => void
	changeCurrent: (v: Model['current']) => void
	showSettingsModal: () => void
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

export interface IPropsHeaderRight {
	tags: Schedule.Setting['tags']
	filter_tags: Model['filter_tags']
	showSettingsModal: IPropsHeader['showSettingsModal']
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
	tags: Schedule.Setting['tags']
	addTimeBlock: Model['addTimeBlock']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: (v: Omit<Schedule.CalendarItem, 'id'>) => void
	updateTodoSchedule: Model['updateTodoSchedule']
}

export interface IPropsCalendarViewDay {
	container: MutableRefObject<HTMLDivElement>
	day: Schedule.CalendarDay
	counts: number
	index: number
	tags: Schedule.Setting['tags']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
	updateTodoSchedule: Model['updateTodoSchedule']
}

export interface IPropsCalendarViewTimeBlock {
	item: Schedule.CalendarItem
	tags: Schedule.Setting['tags']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
	updateTodoSchedule: Model['updateTodoSchedule']
}

export interface IPropsCalendarViewTimeBlockSignal {
	item: Schedule.CalendarItem
}

export interface IPropsCalendarViewTimeBlockDetail {
	item: Schedule.CalendarItem
	tags: Schedule.Setting['tags']
	updateTimeBlock: Model['updateTimeBlock']
	updateTodoSchedule: Model['updateTodoSchedule']
}

export interface IPropsCalendarContextMenu {
	view: Model['view']
	timeblock_copied: Model['timeblock_copied']
	addTimeBlock: Model['addTimeBlock']
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	setting: Model['setting']['setting'] & Model['file']['data']
	closeSettingsModal: () => void
	updateSetting: Model['updateSetting']
	removeTag: Model['removeTag']
}
