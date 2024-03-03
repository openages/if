import { useDebounce } from 'ahooks'
import { useMemo } from 'react'

import { getTextColor } from '@/utils'

export default (v: string) => {
	const bg_color = useDebounce(v, { wait: 450 })

	return useMemo(() => getTextColor(bg_color), [bg_color])
}
