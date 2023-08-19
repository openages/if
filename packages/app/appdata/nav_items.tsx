import { GearSix, Users } from '@phosphor-icons/react'

import type { App } from '@/types'

const default_items = [
	{
		title: 'todo',
		path: '/'
	},
	{
		title: 'memo',
		path: '/memo'
	},
	{
		title: 'note',
		path: '/note'
	},
	{
		title: 'pomodoro',
		path: '/pomodoro'
	},
	{
		title: 'widgets',
		path: '/widgets/layout/kanban'
	}
] as Array<{ title: App.ModuleType; path: string }>

export default default_items

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

export const modules = [
	{
		title: 'kanban',
		path: '/widgets/layout/kanban'
	},
	{
		title: 'flow',
		path: '/widgets/layout/flow'
	},
	{
		title: 'board',
		path: '/widgets/layout/board'
	},
	{
		title: 'project',
		path: '/widgets/layout/project'
	},
	{
		title: 'table',
		path: '/widgets/layout/table'
	},
	{
		title: 'bi',
		path: '/widgets/layout/bi'
	},
	{
		title: 'ppt',
		path: '/widgets/layout/ppt',
		line: true
	},
	{
		title: 'schedule',
		path: '/widgets/layout/schedule'
	},
	{
		title: 'habbit',
		path: '/widgets/layout/habbit'
	}
] as Array<{ title: App.RealModuleType; path: string }>

export const all_nav_items = [...default_items, ...bottom_items, ...modules]
