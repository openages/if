import PQueue from 'p-queue'

import { local } from '@openages/stk/storage'
import { observable } from '@trpc/server/observable'

import type { Router } from '@server/rpcs'
import type { Operation, TRPCLink } from '@trpc/client'

const queue = new PQueue({ concurrency: 1 })

export type Args = {
	tokenRefreshNeeded: (op: Operation) => boolean
	fetchAccessToken: (op: Operation) => Promise<unknown>
}

export default <AppRouter extends Router>(args: Args): TRPCLink<AppRouter> => {
	const { tokenRefreshNeeded, fetchAccessToken } = args

	return () => {
		return ({ next, op }) => {
			return observable(observer => {
				void queue.add(async () => {
					const refresh = tokenRefreshNeeded(op)

					if (refresh) {
						await fetchAccessToken(op)
					}

					next(op).subscribe({
						error(error) {
							if (error.data?.code === 'UNAUTHORIZED') {
								local.removeItem('token')
							}

							observer.error(error)
						},
						next(value) {
							observer.next(value)
						},
						complete() {
							observer.complete()
						}
					})
				})
			})
		}
	}
}
