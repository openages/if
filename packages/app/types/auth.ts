export namespace Auth {
	export const enum UserTypes {
		trial = 'trial',
		std = 'std',
		pro = 'pro',
		team = 'team',
		sponsor = 'sponsor',
		golden_sponsor = 'golden_sponsor'
	}

	export type UserType = keyof typeof UserTypes
}
