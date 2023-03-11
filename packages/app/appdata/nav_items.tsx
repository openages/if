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
		title: 'widgets',
		match: '/widgets/layout',
		path: '/widgets/layout/schedule',
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

export const widgets = [
	{
		title: 'schedule',
		path: '/widgets/layout/schedule',
		checked: true
	},
	{
		title: 'kanban',
		path: '/widgets/layout/kanban',
		checked: true
	},
	{
		title: 'flow',
		path: '/widgets/layout/flow',
		checked: true
	},
	{
		title: 'board',
		path: '/widgets/layout/board',
		checked: true
	},
	{
		title: 'project',
		path: '/widgets/layout/project',
		checked: true
	}
] as const
