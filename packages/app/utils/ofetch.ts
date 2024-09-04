import { ofetch } from 'ofetch'

import { goLogin } from './auth'
import { BASE_URL } from './env'

const handleError = async (status: number, err: unknown) => {
	if (status === 401) return goLogin()

	if (status === 400 && Array.isArray(err)) {
		err.forEach(item => {
			const data = item.error.data

			Object.keys(data).forEach(key => {
				$message.error(`${key}: ${data[key]}`)
			})
		})
	}
}

export const request = ofetch.create({
	responseType: 'stream',
	onRequest() {},
	onResponse() {},
	async onResponseError(res) {
		const { response } = res
		const { status } = response

		const err = await response.json()

		handleError(status, err)
	}
})

export const api = ofetch.create({
	baseURL: BASE_URL + '/api',
	async onResponseError(res) {
		const { response, error } = res
		const { status } = response

		handleError(status, error)
	}
})
