import stringify from 'json-stable-stringify'

import type { Todo } from '@/types'

export default async (file_id: string, data: Partial<Todo.Setting>) => {
	const module_setting = await $db.module_setting.findOne({ selector: { file_id } }).exec()

	const setting = JSON.parse(module_setting.setting) as Todo.Setting

	await module_setting.updateCRDT({
		ifMatch: {
			$set: { setting: stringify({ ...setting, ...data }) }
		}
	})
}
