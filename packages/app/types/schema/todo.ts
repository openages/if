export namespace Todo {
	type Common = {
		/** @maxLength 30 */
		id: string
	}

	type Group = Common & {
		type: 'group'
		title: string
		children: Array<Todo>
	}

	type Todo = Common & {
		type: 'todo'
		text: string
		status: 'checked' | 'unchecked' | 'closed'
		achive_time: number
		/** @maxLength 30 */
		angle_id: string
		tags: Array<{
			/** @maxLength 30 */
			id: string
			color: string
			/** @maxLength 15 */
			text: string
		}>
	}

	export type TodoItem = Group | Todo

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
		settings: {
			auto_archiving: '0m' | '3m' | '3h' | '1d' | '3d' | '7d'
		}
	}
}
