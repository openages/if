import type { Schedule } from '@/types'

import type Model from '../model'

import type { MutableRefObject } from 'react'
import type { DayDetail } from '../utils'

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
	changeFilterTags: (v: Model['filter_tags']) => void
}

export interface IPropsHeaderLeft
	extends Pick<
		IPropsHeader,
		'view' | 'scale' | 'visible_task_panel' | 'toggleVisibleTaskPanel' | 'changeView' | 'changeScale'
	> {}

export interface IPropsHeaderCenter {
	scale: Model['scale']
	current: Model['current']
	step: Model['step']
	changeCurrent: IPropsHeader['changeCurrent']
}

export interface IPropsHeaderRight {
	tags: Schedule.Setting['tags']
	filter_tags: Model['filter_tags']
	showSettingsModal: IPropsHeader['showSettingsModal']
	changeFilterTags: IPropsHeader['changeFilterTags']
}

export interface IPropsDateScale {
	view: Model['view']
	scale: Model['scale']
	days: Model['days']
	show_time_scale: boolean
	scrollToScanline: () => void
}

export interface IPropsDayExtra {
	item: DayDetail
}

export interface IPropsCalendarView {
	container: MutableRefObject<HTMLDivElement>
	view: Model['view']
	calendar_days: Model['calendar_days']
	tags: Schedule.Setting['tags']
	today_index: number
	move_item: Model['move_item']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: (v: Omit<Schedule.CalendarItem, 'id'>) => void
	changeTimeBlockLength: Model['changeTimeBlockLength']
}

export interface IPropsCalendarViewDay {
	container: MutableRefObject<HTMLDivElement>
	view: Model['view']
	day: Schedule.CalendarDay
	counts: number
	index: number
	tags: Schedule.Setting['tags']
	today: boolean
	move_item?: Model['move_item']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
	changeTimeBlockLength: Model['changeTimeBlockLength']
}

export interface IPropsCalendarViewTimeBlockSignal {
	item: Schedule.CalendarItem
}

export interface IPropsCalendarContextMenu {
	view: Model['view']
	timeblock_copied: Model['timeblock_copied']
	addTimeBlock: Model['addTimeBlock']
}

export interface IPropsMonthView {
	view: Model['view']
	days: Model['days']
	calendar_days: Model['calendar_days']
	tags: Schedule.Setting['tags']
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: (v: Omit<Schedule.CalendarItem, 'id'>) => void
	jump: Model['jump']
}

export interface IPropsMonthViewDay {
	day_info: DayDetail
	day: Schedule.CalendarDay
	index: number
	tags: Schedule.Setting['tags']
	fixed_view: boolean
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
	jump: Model['jump']
}

export interface IPropsTimeBlock {
	item: Schedule.CalendarItem
	tags: Schedule.Setting['tags']
	day_index: number
	timeblock_index: number
	month_mode?: boolean
	at_bottom?: boolean
	updateTimeBlock: Model['updateTimeBlock']
	removeTimeBlock: Model['removeTimeBlock']
	copyTimeBlock: IPropsCalendarView['copyTimeBlock']
	changeTimeBlockLength?: Model['changeTimeBlockLength']
}

export interface IPropsTimeBlockDetail {
	item: Schedule.CalendarItem
	tags: Schedule.Setting['tags']
	updateTimeBlock: Model['updateTimeBlock']
}

export interface IPropsSettingsModal {
	visible_settings_modal: Model['visible_settings_modal']
	setting: Model['setting']['setting'] & Model['file']['data']
	closeSettingsModal: () => void
	updateSetting: Model['updateSetting']
	removeTag: Model['removeTag']
	cleanByTime: Model['cleanByTime']
}

export interface IPropsScanline {
	view: Model['view']
	scanline: MutableRefObject<HTMLDivElement>
	scrollToScanline: () => void
}
