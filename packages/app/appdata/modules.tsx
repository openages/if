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
		id: 'typed',
		title: 'typed',
		path: '/typed',
		fixed: true
	},
	{
		id: 'note',
		title: 'note',
		path: '/note',
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
		fixed: true
	},
	{
		id: 'flag',
		title: 'flag',
		path: '/flag'
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
		id: 'setting',
		title: 'setting',
		path: '/setting',
		fixed: true
	}
] as const

export default typed_nav_items.map(item => item)

export const module_default_icon = {
	pomo: ':timer_clock:',
	schedule: ':date:'
}
