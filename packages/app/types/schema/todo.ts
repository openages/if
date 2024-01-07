export namespace Todo {
	type Relations = Array<{ items: Array<string>; checked: boolean }>

	export interface Angle {
		id: string
		text: string
	}

	export interface Tag {
		id: string
		color: string
		text: string
	}

	export interface Setting {
		angles: Array<Angle>
		tags: Array<Tag>
		auto_archiving: '0m' | '3m' | '3h' | '1d' | '3d' | '7d'
		desc?: string
		relations?: Relations
	}

	export interface TodoSetting {
		file_id: string
		module: string
		setting: Setting
	}

	type Common = {
		/** @maxLength 30 */
		id: string
		/** @maxLength 30 */
		file_id: string
		/** @maxLength 30 */
		angle_id: string
		text: string
		sort: number
		create_at: number
	}

	export type Todo = Common & {
		type: 'todo'
		/** @maxLength 12 */
		status: 'checked' | 'unchecked' | 'closed'
		level?: number
		tag_ids?: Array<string>
		remind_time?: number
		cycle_enabled?: boolean
		cycle?:
			| {
					type: 'interval'
					scale: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
					interval: number
					exclude?: Array<number>
			  }
			| {
					type: 'specific'
					scale: 'day' | 'hour'
					value: number
			  }
		/**
		 * @multipleOf 1
		 * @minimum 1
		 * @maximum 9007199254740991
		 * */
		recycle_time?: number
		remark?: string
		archive: boolean
		/**
		 * @multipleOf 1
		 * @minimum 1
		 * @maximum 9007199254740991
		 * */
		archive_time?: number
		schedule?: boolean
		/**
		 * @multipleOf 1
		 * @minimum 1
		 * @maximum 9007199254740991
		 * */
		start_time?: number
		end_time?: number
		children?: Array<{
			id: string
			text: string
			status: 'checked' | 'unchecked'
		}>
	}

	export type Group = Common & {
		type: 'group'
	}

	export type TodoItem = Todo | Group
}
