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
		title: 'note',
		path: '/note',
		checked: true,
		readonly: true
	},
	{
		title: 'schedule',
		path: '/schedule',
		checked: true
	},
	{
		title: 'table',
		path: '/table',
		checked: true
	},
	{
		title: 'powers',
		path: '/powers',
		checked: true
	}
] as Array<{ title: App.MuduleType; path: string; checked: boolean; readonly?: boolean }>

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
		title: 'kanban',
		path: '/kanban',
		checked: true
	},
	{
		title: 'flow',
		path: '/flow',
		checked: true
	},
	{
		title: 'board',
		path: '/board',
		checked: true
	},
	{
		title: 'project',
		path: '/project',
		checked: true
	}
]
