export const modules = ['todo', 'note', 'pomo', 'schedule'] as const

export const limit = {
	free: {
		todo: 3,
		note: 'unlimited',
		pomo: 3,
		schedule: 3
	},
	pro: {
		todo: 'unlimited',
		note: 'unlimited',
		pomo: 'unlimited',
		schedule: 'unlimited'
	}
}
