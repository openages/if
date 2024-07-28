import Color from 'color'
import { useMemo } from 'react'

import type { Schedule } from '@/types'

export default (tags: Schedule.Setting['tags'], tag: Schedule.Item['tag']) => {
	return useMemo(() => {
		if (!tags.length) return {}
		if (!tag) return {}

		const target = tags.find(it => it.id === tag)

		return {
			'--tag_color': Color(target.color).rgb().array().join(','),
			'--tag_bg_color': Color(target.color)
				.alpha(0.18)
				.lighten(0.6)
				.saturationl(90)
				.saturationv(30)
				.toString(),
			'--tag_text_color': Color(target.color).saturationl(0).saturationv(100).chroma(36).toString()
		}
	}, [tag, tags])
}
