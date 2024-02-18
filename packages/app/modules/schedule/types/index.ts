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
	weekdays: Model['weekdays']
}
