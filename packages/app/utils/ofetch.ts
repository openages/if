import { ofetch } from 'ofetch'

import { local } from '@openages/stk/storage'

export const request = ofetch.create({
	responseType: 'stream',
	headers: local.token ? { Authorization: `Bearer ${local.token}` } : {},
	onRequest() {},
	onResponse() {},
	async onResponseError(res) {
		const { request: req, options, response } = res
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
	}
})
