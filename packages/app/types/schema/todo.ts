export namespace Todo {
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
		relations?: Array<{ items: Array<string>; checked: boolean }>
	}

	type Common = {
		/** @maxLength 30 */
		id: string
		/** @maxLength 30 */
		file_id: string
		text: string
		/** @maxLength 30 */
		angle_id: string
		create_at: number
		sort: number
	}

	export type Todo = Common & {
		type: 'todo'
		/** @maxLength 12 */
		status: 'checked' | 'unchecked' | 'closed'
		star?: number
		/**
		 * @multipleOf 1
		 * @minimum 1
		 * @maximum 9999999999000
		 * */
		archive_time?: number
		tag_ids?: Array<string>
		circle_enabled: boolean
		circle_value?: Array<number>
		children?: Array<
			Omit<
				Todo,
				| 'file_id'
				| 'angle_id'
				| 'sort'
				| 'star'
				| 'archive_time'
				| 'tag_ids'
				| 'circle_enabled'
				| 'circle_value'
				| 'children'
			>
		>
	}

	export type Group = Common & {
		type: 'group'
	}

	export type TodoItem = Todo | Group
}
