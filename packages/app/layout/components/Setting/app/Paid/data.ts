export const modules = ['todo', 'note', 'pomo', 'schedule'] as const

export const limit = {
	free: {
		todo: 1,
		note: 'unlimited',
		pomo: 1,
		schedule: 1
	},
	pro: {
		todo: 'unlimited',
		note: 'unlimited',
		pomo: 'unlimited',
		schedule: 'unlimited'
	}
}
