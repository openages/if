export const modules = ['todo', 'note', 'pomo', 'schedule'] as const

export const limit = {
	free: {
		todo: 6,
		note: 'unlimited',
		pomo: 6,
		schedule: 6
	},
	pro: {
		todo: 'unlimited',
		note: 'unlimited',
		pomo: 'unlimited',
		schedule: 'unlimited'
	}
}
