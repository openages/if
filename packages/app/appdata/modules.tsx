const typed_nav_items = [
	{
		title: 'todo',
		path: '/',
		is_fixed: true
	},
	{
		title: 'memo',
		path: '/memo',
		is_fixed: true
	},
	{
		title: 'note',
		path: '/note',
		is_fixed: true
	},
	{
		title: 'kanban',
		path: '/kanban'
	},
	{
		title: 'flow',
		path: '/flow'
	},
	{
		title: 'whiteboard',
		path: '/whiteboard'
	},
	{
		title: 'table',
		path: '/table'
	},
	{
		title: 'form',
		path: '/form'
	},
	{
		title: 'chart',
		path: '/chart'
	},
	{
		title: 'ppt',
		path: '/ppt'
	},
	{
		title: 'schedule',
		path: '/schedule'
	},
	{
		title: 'pomodoro',
		path: '/pomodoro'
	},
	{
		title: 'habbit',
		path: '/habbit'
	},
	{
		title: 'api',
		path: '/api'
	},
	{
		title: 'metatable',
		path: '/metatable'
	},
	{
		title: 'metaform',
		path: '/metaform'
	},
	{
		title: 'metachart',
		path: '/metachart'
	},
	{
		title: 'setting',
		path: '/setting'
	}
] as const

export default typed_nav_items.map((item) => item)
