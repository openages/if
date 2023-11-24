export namespace DirTree {
	export type Item = {
		/** @maxLength 30 */
		module: string
		type: 'dir' | 'file'
		id: string
		name: string
		pid?: string
		prev_id?: string
		next_id?: string
		icon?: string
		icon_hue?: number
	}

	export type TransformedItem = Item & {
		children?: Array<TransformedItem>
	}

	export type Items = Array<Item>
	export type TransformedItems = Array<TransformedItem>
}
