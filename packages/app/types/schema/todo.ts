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
		/** @maxLength 15 */
		angle: string
		tags: Array<{
			color: string
			/** @maxLength 15 */
			text: string
		}>
	}

	export type TodoItem = Group | Todo

	export interface Data {
		/** @maxLength 30 */
		id: string
		name: string
		icon: string
		desc?: string
		angles: Array<string>
		angle: string
		tags: Array<{
			color: string
			text: string
		}>
		settings: {
			auto_archiving: '0m' | '3m' | '3h' | '1d' | '3d' | '7d'
		}
	}
}
