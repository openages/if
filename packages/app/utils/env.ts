import { is_prod, is_sandbox } from './is'

export const BASE_URL = is_sandbox
	? 'https://if-server-sandbox.openages.com'
	: is_prod
		? 'https://if-server.openages.com'
		: 'http://localhost:8080'
