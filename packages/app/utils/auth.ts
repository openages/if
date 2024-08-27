import lz from 'lz-string'

import { local } from '@openages/stk/storage'

import type { Trpc } from '@/types'

export const getUserData = () => {
	const local_user = local.user

	return local_user ? (JSON.parse(lz.decompress(local_user)) as Trpc.UserData) : null
}
