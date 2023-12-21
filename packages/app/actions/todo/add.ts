import { id } from '@/utils'

export default async (file_id: string) => {
	// @ts-ignore
	const angles = $t('translation:todo.default_angles', { returnObjects: true }) as Array<string>

	return $db.collections.todo.insert({
		id: file_id,
		angles: angles.map(item => ({ id: id(), text: item })),
		tags: [],
		auto_archiving: '3m'
	})
}
