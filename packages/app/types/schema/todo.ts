import type { ModuleSetting } from '@/types'

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
		links?: Array<{
			type: string
			id: string
		}>
	}

	export interface TodoSetting extends Pick<ModuleSetting.Item, 'file_id' | 'module'> {
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
		schedule?: boolean
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
