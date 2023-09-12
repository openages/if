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
		relations?: Array<{ items: Array<string>; checked: boolean }>
		settings: {
			auto_archiving: '0m' | '3m' | '3h' | '1d' | '3d' | '7d'
		}
	}

	type Common = {
		/** @maxLength 30 */
		id: string
		text: string
		/** @maxLength 30 */
		angle_id: string
		create_at: number
	}

	export type Todo = Common & {
		type: 'todo'
		status: 'checked' | 'unchecked' | 'closed'
		star?: number
		archive_time?: number
		tag_ids?: Array<string>
		circle?: {
			enabled: boolean
			value: Array<number>
		}
		children?: Array<Omit<Todo, 'angle_id' | 'star' | 'archive_time' | 'tag_ids' | 'circle' | 'children'>>
	}

	export type Group = Common & {
		type: 'group'
	}

	export type TodoItem = Todo | Group
}
