import { Schedule } from '@/types'

import Model from '../model'

export interface IProps {
	id: string
}

export interface IPropsHeader {
	view: Model['view']
	scale: Model['scale']
	current: Model['current']
	visible_task_panel: Model['visible_task_panel']
	step: Model['step']
}

export interface IPropsHeaderCenter {
	current: Model['current']
	step: Model['step']
}

export interface IPropsDateScale {
	scale: Model['scale']
	weekdays: Model['weekdays']
}
