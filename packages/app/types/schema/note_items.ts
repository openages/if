export namespace Note {
	export interface Setting {
		show_heading_level: boolean
		serif: boolean
		small_text: boolean
		toc: 'default' | 'visible' | 'minimize' | 'hidden'
		count: boolean
	}

	export type Item = {
		/** @maxLength 30 */
		file_id: string
		/** @maxLength 30 */
		id: string
		prev?: string
		next?: string
		content: string
		create_at: number
		update_at?: number
		extends?: string
	}
}
