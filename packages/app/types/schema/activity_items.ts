export namespace Activity {
	export type Item = {
		/** @maxLength 30 */
		id: string
		/** @maxLength 15 */
		module: string
		/** @maxLength 30 */
		file_id: string
		name: string
		action: Action
		context?: string
		update_at?: number
	}

	export type TodoAction = 'insert' | 'check'

	export type PomoAction = 'done'

	export type Action = TodoAction | PomoAction
}
