import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { dirtree_excludes } from '@/appdata'

export default () => {
	const { pathname } = useLocation()

	const no_dirtree = useMemo(() => dirtree_excludes.some((item) => pathname.indexOf(item) !== -1), [pathname])

	return { no_dirtree }
}
