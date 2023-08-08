import { useMemo } from 'react'

import { limits } from '@/appdata'
import { useGetLocale } from '@/hooks'

export default () => {
	const locale = useGetLocale()

	return useMemo(() => limits[locale], [locale])
}
