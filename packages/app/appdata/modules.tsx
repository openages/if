import type { App } from '@/types'

const typed_nav_items = [
	{
		id: 'todo',
		title: 'todo',
		path: '/',
		fixed: true
	},
	{
		id: 'memo',
		title: 'memo',
		path: '/memo',
		fixed: true
	},
	{
		id: 'note',
		title: 'note',
		path: '/note',
		fixed: true
	},
	{
		id: 'page',
		title: 'page',
		path: '/page',
		fixed: true
	},
	{
		id: 'whiteboard',
		title: 'whiteboard',
		path: '/whiteboard'
	},
	{
		id: 'ppt',
		title: 'ppt',
		path: '/ppt'
	},
	{
		id: 'pomo',
		title: 'pomo',
		path: '/pomo',
		fixed: true
	},
	{
		id: 'schedule',
		title: 'schedule',
		path: '/schedule',
		short: 5,
		fixed: true
	},
	{
		id: 'flag',
		title: 'flag',
		path: '/flag'
	},
	{
		id: 'table',
		title: 'table',
		path: '/table'
	},
	{
		id: 'form',
		title: 'form',
		path: '/form'
	},
	{
		id: 'chart',
		title: 'chart',
		path: '/chart'
	},
	{
		id: 'api',
		title: 'api',
		path: '/api'
	},
	{
		id: 'dataflow',
		title: 'dataflow',
		path: '/dataflow'
	},
	{
		id: 'database',
		title: 'database',
		path: '/database'
	},
	{
		id: 'setting',
		title: 'setting',
		path: '/setting',
		event: 'global.setting.toggleVisible',
		fixed: true
	}
] as const

export default typed_nav_items.map(item => item)

export const module_default_icon = {
	note: ':book-open-text-light:',
	pomo: ':watch:',
	schedule: ':date:'
}

export const module_group = {
	content: ['todo', 'memo', 'note', 'page', 'whiteboard', 'ppt'],
	plan: ['flow', 'schedule', 'pomo', 'flag'],
	data: ['table', 'form', 'chart', 'api', 'dataflow', 'database'],
	setting: ['setting']
}

export const getGroupModules = (modules: App.Modules) => {
	return Object.keys(module_group).reduce(
		(total, group_name: keyof typeof module_group) => {
			const groups = module_group[group_name]

			total.push({
				name: group_name,
				items: modules.filter(item => groups.includes(item.title))
			})

			return total
		},
		[] as Array<{ name: keyof typeof module_group; items: App.Modules }>
	)
}
