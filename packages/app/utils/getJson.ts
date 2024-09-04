import type { ClientResponse } from 'hono/client'
import type { StatusCode } from 'hono/utils/http-status'

export default async <T>(res: ClientResponse<T, StatusCode, 'json'>) => res.json()
