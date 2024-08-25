import to from 'await-to-js'
import lz from 'lz-string'
import { ofetch } from 'ofetch'

import { local } from '@openages/stk/storage'

import conf from './conf'
import trpc from './trpc'

let is_refreshing_token = false

const retry_map = new Map()

const relogin = () => {
	retry_map.clear()

	is_refreshing_token = false

	local.removeItem('user')

	window.location.reload()
}

export const request = ofetch.create({
	responseType: 'stream',
	onRequest() {},
	onResponse() {},
	async onResponseError(res) {
		const { request, options, response } = res
		const err = await response.json()
		const status = response.status

		if (status === 400 && Array.isArray(err)) {
			err.forEach(item => {
				const data = item.error.data

				Object.keys(data).forEach(key => {
					$message.error(`${key}: ${data[key]}`)
				})
			})
		}

		if (status === 401) {
			const mid = (await conf.get('mid')) as string

			if (!is_refreshing_token) {
				is_refreshing_token = true

				const compressed_user = local.user

				if (!compressed_user) {
					retry_map.clear()

					is_refreshing_token = false

					$message.error($t('app.auth.not_login'))

					return
				}

				const user = JSON.parse(lz.decompress(compressed_user))
				const token = local.token

				const [err, res] = await to(
					trpc.auth.refreshToken.mutate({
						mid,
						id: user.id,
						token,
						refresh_token: user.refresh_token
					})
				)

				if (err || res.error) relogin()
			} else {
				retry_map.set(request, { request, options })
			}
		}
	}
})
