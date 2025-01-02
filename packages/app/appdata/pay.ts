export const plan_level = new Map([
	['free', 0],
	['pro', 1],
	['max', 2],
	['team', 3],
	['sponsor', 4],
	['gold_sponsor', 5]
] as const)

export const paddle = {
	sandbox: {
		price_id: {
			pro: 'pri_01jgk3rw9pstc64rdyp00v8de5',
			infinity: 'pri_01jgk3txm1myyh6c292p7zfyzk'
		}
	},
	production: {
		price_id: {
			pro: '',
			infinity: ''
		}
	}
}
