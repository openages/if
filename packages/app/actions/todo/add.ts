import { id } from '@/utils'

import type { DirTree } from '@/types'

export default async (file_id: string, args: Partial<DirTree.File>) => {
	// @ts-ignore
	const angles = $t('translation:todo.default_angles', { returnObjects: true }) as Array<string>

	await $db.collections.todo.insert({
		...args,
		id: file_id,
		angles: angles.map((item) => ({ id: id(), text: item })),
		tags: [],
		settings: {
			auto_archiving: '3m'
		}
	})

	return
}
