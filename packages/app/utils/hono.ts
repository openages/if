import { hc } from 'hono/client'

import { BASE_URL } from './env'

import type { Api } from '@server/apis'

export default hc<Api>(BASE_URL + '/api')
