import to from 'await-to-js'
import { jwtDecode } from 'jwt-decode'
import lz from 'lz-string'

import { local } from '@openages/stk/storage'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import conf from './conf'
import { BASE_URL } from './env'
import { request } from './ofetch'
import trpcRefreshTokenLink from './trpcRefreshTokenLink'

import type { Router } from '@server/rpcs'

const trpc = createTRPCProxyClient<Router>({
	links: [
		trpcRefreshTokenLink({
			tokenRefreshNeeded(op) {
				if (op.path.indexOf('auth.refreshToken') !== -1) return false
				if (!local.token) return false

				const exp = jwtDecode(local.token).exp!
				const now = Math.floor(Date.now() / 1000)

				if (exp <= now) return true

				return false
			},
			async fetchAccessToken() {
				const compressed_user = local.user

				if (!compressed_user) return $message.error($t('app.auth.not_login'))

				const user = JSON.parse(lz.decompress(compressed_user))
				const mid = (await conf.get('mid')) as string

				const [err, res] = await to(
					trpc.auth.refreshToken.mutate({
						mid,
						id: user.id,
						token: local.token,
						refresh_token: user.refresh_token
					})
				)

				if (err || res.error) {
					local.removeItem('user')

					return window.location.reload()
				}

				const { data } = res

				if (typeof data === 'string') {
					local.token = data
				} else {
					local.token = data.token

					local.user = lz.compress(JSON.stringify({ ...user, refresh_token: data.refresh_token }))
				}
			}
		}),
		httpBatchLink({
			url: BASE_URL + '/trpc',
			async fetch(input, options) {
				return request.raw(input as string, options)
			}
		})
	],
	transformer: undefined
})

export default trpc
