import { useDebounce } from 'ahooks'
import { useMemo } from 'react'

import { getTagColor } from '@/utils'

export default (v: string) => {
	const color = useDebounce(v, { wait: 450 })

	return useMemo(() => getTagColor(color), [color])
}
