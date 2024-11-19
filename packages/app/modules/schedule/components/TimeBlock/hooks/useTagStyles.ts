import Color from 'color'
import { useMemo } from 'react'

import { getTagColor } from '@/utils'

import type { Schedule } from '@/types'
import type { Theme } from '@/appdata'

export default (tags: Schedule.Setting['tags'], tag: Schedule.Item['tag'], theme: Theme) => {
	return useMemo(() => {
		if (!tags.length) return {}
		if (!tag) return {}

		const target = tags.find(it => it.id === tag)!
		const { bg_color } = getTagColor(target.color, theme)

		return {
			'--tag_color': Color(target.color).rgb().array().join(','),
			'--tag_bg_color': bg_color
		}
	}, [tag, tags, theme])
}
