import stringify from 'json-stable-stringify'

import { id } from '@/utils'

export default async (file_id: string) => {
	const angles = $t('translation:todo.default_angles') as Array<string>

	return $db.module_setting.insertCRDT({
		ifMatch: {
			$set: {
				module: 'todo',
				file_id,
				setting: stringify({
					angles: angles.map(item => ({ id: id(), text: item })),
					tags: [],
					auto_archiving: '3m'
				}),
				create_at: new Date().valueOf()
			}
		}
	})
}
