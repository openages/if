import { id } from '@/utils'
import stringify from './stringify'

export default async (file_id: string) => {
	// @ts-ignore
	const angles = $t('translation:todo.default_angles', { returnObjects: true }) as Array<string>

	return $db.collections.module_setting.insert({
		module: 'todo',
		file_id,
		setting: stringify({
			angles: angles.map(item => ({ id: id(), text: item })),
			tags: [],
			auto_archiving: '3m'
		})
	})
}
