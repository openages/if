import { useDebounce } from 'ahooks'
import Color from 'color'
import { useMemo } from 'react'

export default (v: string) => {
	const color = useDebounce(v, { wait: 450 })

	return useMemo(
		() => ({
			bg_color: Color(color).alpha(0.48).lighten(0.6).saturationl(90).saturationv(30).toString(),
			text_color: Color(color).saturationl(0).saturationv(100).chroma(36).toString()
		}),
		[color]
	)
}
