import { GearSix, Users } from '@phosphor-icons/react'

import type { App } from '@/types'

export default [
	{
		title: 'todo',
		path: '/',
		checked: true,
		readonly: true
	},
	{
		title: 'memo',
		path: '/memo',
		checked: true,
		readonly: true
	},
	{
		title: 'note',
		path: '/note',
		checked: true,
		readonly: true
	},
	{
		title: 'table',
		path: '/table',
		checked: true
	},
	{
		title: 'ppt',
		path: '/ppt',
		checked: true
	},
	{
		title: 'pomodoro',
		path: '/pomodoro',
		checked: true
	},
	{
		title: 'plan',
		match: '/plan/layout',
		path: '/plan/layout/schedule',
		checked: true
	}
] as Array<{ title: App.MuduleType; path: string; checked: boolean; match?: string; readonly?: boolean }>

export const bottom_items = [
	{
		title: 'collaboration',
		path: '/collaboration',
		icon: Users
	},
	{
		title: 'setting',
		path: '/setting',
		icon: GearSix
	}
] as const

export const plan_items = [
	{
		title: 'schedule',
		path: '/plan/layout/schedule',
		checked: true
	},
	{
		title: 'kanban',
		path: '/plan/layout/kanban',
		checked: true
	},
	{
		title: 'flow',
		path: '/plan/layout/flow',
		checked: true
	},
	{
		title: 'board',
		path: '/plan/layout/board',
		checked: true
	},
	{
		title: 'project',
		path: '/plan/layout/project',
		checked: true
	}
] as const
