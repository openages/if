import { GearSix, Users } from '@phosphor-icons/react'

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
] as const

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
		path: '/widgets/layout/schedule'
	},
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
		path: '/widgets/layout/ppt'
	}
] as const
