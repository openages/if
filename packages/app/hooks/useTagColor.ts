import checkColor from '@check-light-or-dark/color'
import { useDebounce } from 'ahooks'
import { useMemo } from 'react'

export default (v: string) => {
	const bg_color = useDebounce(v, { wait: 450 })

	return useMemo(() => (checkColor(v) === 'light' ? 'black' : 'white'), [bg_color])
}
