import type { Auth } from './auth'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { Router } from '@server/rpcs'

export namespace Trpc {
	export interface UserData {
		id: string
		name: string
		email: string
		avatar: string
		paid_plan: Auth.UserType
		paid_expire: number | null
		paid_renewal: boolean | null
		is_infinity: boolean
		refresh_token: string
	}

	export interface ResSign extends UserData {
		token: string
	}

	export type Input = inferRouterInputs<Router>
	export type Output = inferRouterOutputs<Router>
}
