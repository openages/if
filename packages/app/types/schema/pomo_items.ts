export namespace Pomo {
	export interface Session {
		id: string
		title: string
		work_time: number
		break_time: number
		flow_mode: boolean
	}

	export type Item = {
		/** @maxLength 120 */
		file_id: string
		sessions: Array<Session>
		index: number
		status: 'work' | 'break' | ''
		work_in: number
		break_in: number
		continuous_mode: boolean
		create_at: number
		update_at?: number
	}
}
