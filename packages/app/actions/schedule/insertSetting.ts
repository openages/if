import stringify from 'json-stable-stringify'

export default async (file_id: string) => {
	return $db.module_setting.insert({
		module: 'schedule',
		file_id,
		setting: stringify({
			mode: 'timeline',
			tags: []
		}),
		create_at: new Date().valueOf()
	})
}
