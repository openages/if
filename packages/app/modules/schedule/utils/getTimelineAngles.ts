import type Model from '../model'

import type { Schedule } from '@/types'

export default (timeline_angles: Schedule.Setting['timeline_angles']) => {
	const target = {} as Model['timeline_angles']

	timeline_angles.forEach(item => {
		item.rows.forEach(row_id => (target[row_id] = []))
	})

	return target
}
