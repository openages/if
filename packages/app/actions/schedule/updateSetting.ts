import stringify from 'json-stable-stringify'

import remove from './remove'

import type { Schedule, Extend } from '@/types'

export default async (file_id: string, data: Partial<Schedule.Setting>) => {
	if (data.mode) {
		const res = await remove({ id: file_id } as Extend.DirTree.TransformedItem, true)

		if (!res) return
	}

	const module_setting = await $db.module_setting.findOne({ selector: { file_id } }).exec()

	const setting = JSON.parse(module_setting.setting) as Schedule.Setting

	await module_setting.updateCRDT({
		ifMatch: {
			$set: { setting: stringify({ ...setting, ...data }) }
		}
	})
}
