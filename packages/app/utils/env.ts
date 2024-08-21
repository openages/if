import { is_prod } from './is'

export const BASE_URL = is_prod ? 'https://if-server.openages.com' : 'http://localhost:8080'
