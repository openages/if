import { ofetch } from 'ofetch'

import { goLogin } from './auth'
import { BASE_URL } from './env'

const handleReqError = async (status: number, err: Error) => {
	$message.error(`${status}: ${err?.message}`)
}

const handleResError = async (status: number, err: unknown) => {
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
	onRequestError(res) {
		const { response, error } = res
		const { status } = response!

		handleReqError(status, error)
	},
	async onResponseError(res) {
		const { response } = res
		const { status } = response

		const err = await response.json()

		handleResError(status, err)
	}
})

export const api = ofetch.create({
	baseURL: BASE_URL + '/api',
	onRequestError(res) {
		const { response, error } = res
		const { status } = response!

		handleReqError(status, error)
	},
	async onResponseError(res) {
		const { response, error } = res
		const { status } = response

		handleResError(status, error)
	}
})
