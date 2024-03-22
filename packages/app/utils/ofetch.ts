import { ofetch } from 'ofetch'

export const request = ofetch.create({
	baseURL: '/api',
	onRequest() {},
	onResponse() {},
	onResponseError() {}
})
