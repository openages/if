export namespace Todo {
	type Common = {}

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
		angle: string
		tags: Array<{
			color: string
			text: string
		}>
	}

	export type TodoItem = Group | Todo

	export interface Data {
		/** @maxLength 30 */
		id: string
		name: string
		desc?: string
		angles: Array<string>
		tags: Array<{
			color: string
			text: string
		}>
	}
}
