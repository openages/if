import type { Pomo } from '@/types'

export default async () => {
	const counts = await $db.kv.count({ selector: { key: 'pomo_settings' } }).exec()

	if (counts) return

	await $db.kv.insert({
		key: 'pomo_settings',
		value: JSON.stringify({ sound: true } as Pomo.Setting)
	})
}
