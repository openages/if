const typed_nav_items = [
	{
		id: 'todo',
		title: 'todo',
		path: '/',
		is_fixed: true
	},
	{
		id: 'memo',
		title: 'memo',
		path: '/memo',
		is_fixed: true
	},
	{
		id: 'note',
		title: 'note',
		path: '/note',
		is_fixed: true
	},
	{
		id: 'kanban',
		title: 'kanban',
		path: '/kanban'
	},
	{
		id: 'flow',
		title: 'flow',
		path: '/flow'
	},
	{
		id: 'whiteboard',
		title: 'whiteboard',
		path: '/whiteboard'
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
		id: 'ppt',
		title: 'ppt',
		path: '/ppt'
	},
	{
		id: 'schedule',
		title: 'schedule',
		path: '/schedule'
	},
	{
		id: 'pomodoro',
		title: 'pomodoro',
		path: '/pomodoro'
	},
	{
		id: 'habbit',
		title: 'habbit',
		path: '/habbit'
	},
	{
		id: 'api',
		title: 'api',
		path: '/api'
	},
	{
		id: 'metatable',
		title: 'metatable',
		path: '/metatable'
	},
	{
		id: 'metaform',
		title: 'metaform',
		path: '/metaform'
	},
	{
		id: 'metachart',
		title: 'metachart',
		path: '/metachart'
	},
	{
		id: 'setting',
		title: 'setting',
		path: '/setting'
	}
] as const

export default typed_nav_items.map((item) => item)
