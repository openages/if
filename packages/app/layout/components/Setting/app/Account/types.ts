import type { Auth } from '@/models'

export interface IPropsSign {
	sign_type: Auth['sign_type']
	signin: Auth['signin']
	signup: Auth['signup']
	sendVerifyCode: Auth['sendVerifyCode']
}
