import { getObjectKeys } from '@/utils'

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
		fixed: true,
		plan: true
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
		fixed: true,
		plan: true
	},
	{
		id: 'whiteboard',
		title: 'whiteboard',
		path: '/whiteboard',
		plan: true
	},
	{
		id: 'ppt',
		title: 'ppt',
		path: '/ppt',
		plan: true
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
		path: '/flag',
		plan: true
	},
	{
		id: 'table',
		title: 'table',
		path: '/table',
		plan: true,
		deving: true
	},
	{
		id: 'form',
		title: 'form',
		path: '/form',
		plan: true
	},
	{
		id: 'chart',
		title: 'chart',
		path: '/chart',
		plan: true
	},
	{
		id: 'api',
		title: 'api',
		path: '/api',
		plan: true
	},
	{
		id: 'dataflow',
		title: 'dataflow',
		path: '/dataflow',
		plan: true
	},
	{
		id: 'database',
		title: 'database',
		path: '/database',
		plan: true
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

export const modules_no_setting = typed_nav_items.slice(0, -1)

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
	return getObjectKeys(module_group).reduce(
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
