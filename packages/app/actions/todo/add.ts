import addRefs from './addRefs'

export default async (name: string, icon: string, file_id: string) => {
	// @ts-ignore
	const angles = $t('translation:todo.default_angles', { returnObjects: true })

	await $db.collections.todo.insert({
		id: file_id,
		name,
		icon,
		angles,
		angle: angles[0],
		tags: [],
		settings: {
			auto_archiving: '3m'
		}
	})

	await addRefs(file_id)

	return
}
