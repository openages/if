export namespace Auth {
	export const enum UserTypes {
		trial = 'trial',
		/** $3 每月（所有离线基础功能 + Server） */
		std = 'std',
		/** $12 每月（AI + Share） */
		pro = 'pro',

		/** 600元/100刀/1000欧 每月（100位） Discord在线支持Group */
		sponsor = 'sponsor',
		/** 6000元/1000刀/10000欧（12位） Discord在线支持Group */
		golden_sponsor = 'golden_sponsor',

		/** 付费用户未达到一定量之前不开放 $60 每月每人
		 *  Cloud Pages：云端页面，并提供 Console 对云端进行管理（用户、权限、资源开放性）
		 *  Server Studio：基于flow自定义Server逻辑，对接企业内部数据
		 */
		team = 'team'
	}

	/** ¥120 终生（std）infinity作为user的一个属性存在 infinity用户不会再进行“可用性校验” */
	// infinity = boolean

	export type UserType = keyof typeof UserTypes
}
