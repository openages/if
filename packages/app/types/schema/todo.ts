export namespace Todo {
	type Relations = Array<{ items: Array<string>; checked: boolean }>

	export interface Data {
		/** @maxLength 30 */
		id: string
		desc?: string
		angles: Array<{
			id: string
			text: string
		}>
		tags: Array<{
			id: string
			color: string
			text: string
		}>
		auto_archiving: '0m' | '3m' | '3h' | '1d' | '3d' | '7d'
		relations?: Relations
	}

	type Common = {
		/** @maxLength 30 */
		id: string
		/** @maxLength 30 */
		file_id: string
		/** @maxLength 30 */
		angle_id: string
		text: string
		create_at: number
		sort: number
	}

	export type Todo = Common & {
		type: 'todo'
		/** @maxLength 12 */
		status: 'checked' | 'unchecked' | 'closed'
		open?: boolean
		star?: number
		tag_ids?: Array<string>
		options_width?: number
		remind_time?: number
		cycle_enabled?: boolean
		cycle?: {
			scale: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
			interval: number
			exclude?: Array<number>
		}
		recycle_time?: number
		links?: Array<{
			type: string
			id: string
		}>
		remark?: string
		archive?: boolean
		archive_time?: number
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
