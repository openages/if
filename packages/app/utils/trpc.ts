import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import { BASE_URL } from './env'

import type { Router } from '@server/rpcs'

export default createTRPCProxyClient<Router>({
	links: [httpBatchLink({ url: BASE_URL + '/trpc' })],
	transformer: undefined
})
