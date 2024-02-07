import { id } from '@/utils'

export default async (file_id: string) => {
	return $db.pomo_items.insertCRDT({
		ifMatch: {
			$set: {
				file_id,
				sessions: [
					{
						id: id(),
						title: '',
						work_time: 45,
						break_time: 15,
						done: false,
						flow_mode: false
					}
				],
				index: 0,
				current: '',
				going: false,
				work_in: 0,
				break_in: 0,
				continuous_mode: false,
				create_at: new Date().valueOf()
			}
		}
	})
}
