export namespace Note {
	export interface Setting {
		serif: boolean
		small_text: boolean
		toc: 'default' | 'visible' | 'minimize' | 'hidden'
		count: boolean
	}

	export type Item = {
		/** @maxLength 30 */
		id: string
		/** @maxLength 30 */
		file_id: string
		content: string
	}
}
