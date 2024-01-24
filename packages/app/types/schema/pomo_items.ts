export namespace Pomo {
	export interface Session {
		id: string
		title: string
		work_time: number
		break_time: number
		done: boolean
		flow_mode: boolean
	}

	export type Item = {
		/** @maxLength 120 */
		file_id: string
		sessions: Array<Session>
		continuous_mode: boolean
		create_at: number
		update_at?: number
	}
}
