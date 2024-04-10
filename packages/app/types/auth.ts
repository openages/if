export namespace Auth {
	export const enum UserTypes {
		trial = 'trial',
		/** $3 每月（所有离线基础功能） */
		std = 'std',
		/** $9 每月（AI + Sync + Share） */
		pro = 'pro',
		/** $30 每月（Cloud Pages + 独立server，只有team用户可接入独立server） */
		team = 'team',
		/** 600元/100刀/1000欧 每月（100位） Discord在线支持Group */
		sponsor = 'sponsor',
		/** 6000元/1000刀/10000欧（12位） Discord在线支持Group */
		golden_sponsor = 'golden_sponsor'
	}

	/** ¥120 终生（仅可使用离线功能）infinity作为user的一个属性存在 */
	// infinity = boolean

	export type UserType = keyof typeof UserTypes
}
