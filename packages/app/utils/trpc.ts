import to from 'await-to-js'
import { jwtDecode } from 'jwt-decode'
import lz from 'lz-string'

import { local } from '@openages/stk/storage'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

import { BASE_URL } from './env'
import { request } from './ofetch'
import trpcRefreshTokenLink from './trpcRefreshTokenLink'

import type { Router } from '@server/rpcs'

const ignore_paths = ['auth.sendVerifyCode', 'auth.signup', 'auth.signin', 'auth.refreshToken']

const trpc = createTRPCProxyClient<Router>({
	links: [
		trpcRefreshTokenLink({
			tokenRefreshNeeded(op) {
				if (ignore_paths.includes(op.path)) return

				if (!local.token) return $message.warning($t('app.auth.not_login'))

				const exp = jwtDecode(local.token).exp! * 1000
				const now = Date.now()

				if (exp <= now) return true

				return
			},
			async fetchAccessToken() {
				const compressed_user = local.user

				if (!compressed_user) return $message.error($t('app.auth.not_login'))

				const user = JSON.parse(lz.decompress(compressed_user))

				const [err, res] = await to(
					trpc.auth.refreshToken.mutate({
						mid: local.mid,
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
			async headers() {
				return local.token ? { Authorization: `Bearer ${local.token}` } : {}
			},
			async fetch(input, options) {
				return request.raw(input as string, options)
			}
		})
	],
	transformer: undefined
})

export default trpc
