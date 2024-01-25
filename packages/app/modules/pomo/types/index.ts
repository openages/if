import { Pomo } from '@/types'

import Model from '../model'

export interface IProps {
	id: string
}

export interface IPropsSession {
	item: Pomo.Session
	is_dark_theme: boolean
	name: Model['file']['data']['name']
	state: Model['state']
}

export interface IPropsActions {}
