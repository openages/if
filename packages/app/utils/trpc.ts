import { local } from '@openages/stk/storage'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import { BASE_URL } from './env'
import { request } from './ofetch'

import type { Router } from '@server/rpcs'

export default createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: BASE_URL + '/trpc',
			fetch(input: string, options) {
				return request.raw(input, options)
			},
			async headers() {
				return local.token ? { Authorization: `Bearer ${local.token}` } : {}
			}
		})
	],
	transformer: undefined
})
