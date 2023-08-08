import { useMemo } from 'react'

import { dirtree_excludes } from '@/appdata'
import { useLocation } from '@umijs/max'

export default () => {
	const { pathname } = useLocation()

	const no_dirtree = useMemo(() => dirtree_excludes.some((item) => pathname.indexOf(item) !== -1), [pathname])

	return { no_dirtree }
}
