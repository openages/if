import { Tag } from '../common'

export namespace ScheduleItems {
	export interface Setting {
		type: 'timeline' | 'fixed'
		tags: Array<Tag>
	}

	export interface ScheduleSetting {
		file_id: string
		module: string
		setting: Setting
	}

	export interface Item {
		id: string
		file_id: string
		tag: string
		text: string
		todos: Array<string>
		start_time: number
		end_time: number
	}
}
