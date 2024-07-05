export namespace Note {
	export interface Setting {
		serif: boolean
		small_text: boolean
		toc: 'default' | 'visible' | 'minimize' | 'hidden'
		count: boolean
	}

	export type Item = {
		/** @maxLength 42 */
		id: string
		/** @maxLength 30 */
		file_id: string
		/** @maxLength 9 */
		key: string
		content: string
	}
}
