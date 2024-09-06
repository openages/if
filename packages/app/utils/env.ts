import { is_prod } from './is'

const { SANDBOX } = process.env

export const BASE_URL = SANDBOX
	? 'https://if-server-sandbox.openages.com'
	: is_prod
		? 'https://if-server.openages.com'
		: 'http://localhost:8080'
