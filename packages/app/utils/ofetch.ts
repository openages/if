import { ofetch } from 'ofetch'

export const request = ofetch.create({
	responseType: 'stream',
	onRequest() {},
	onResponse() {},
	async onResponseError(res) {
		const { response } = res
		const { status } = response

		const err = await response.json()

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
