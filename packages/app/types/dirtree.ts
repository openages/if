export namespace DirTree {
	export type Item = {
		/** @maxLength 30 */
		module: string
		type: 'dir' | 'file'
		/** @maxLength 30 */
		id: string
		name: string
		create_at: number
		pid?: string
		prev_id?: string
		next_id?: string
		icon?: string
		icon_hue?: number
		update_at?: number
		backup_at?: number
	}

	export type TransformedItem = Item & {
		children?: Array<TransformedItem>
	}

	export type Items = Array<Item>
	export type TransformedItems = Array<TransformedItem>
}
