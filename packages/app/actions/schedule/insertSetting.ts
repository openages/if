import stringify from 'json-stable-stringify'

import { getIds, id } from '@/utils'

import type { Schedule } from '@/types'

export default async (file_id: string) => {
	return $db.module_setting.insert({
		module: 'schedule',
		file_id,
		setting: stringify({
			mode: 'timeline',
			tags: [],
			timeline_angles: [
				{
					id: id(),
					text: $t('translation:common.default'),
					rows: getIds(3)
				}
			]
		} as Schedule.Setting),
		create_at: new Date().valueOf()
	})
}
